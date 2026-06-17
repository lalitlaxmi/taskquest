const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { validateEmail } = require("../utils/emailValidator");

const {
  generateOTP,
  hashOTP,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_MAX_ATTEMPTS,
} = require("../utils/otp");

const {
  sendOTPEmail,
  sendWelcomeEmail,
} = require("../services/emailService");


// JWT TOKEN
const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );


// PUBLIC USER DATA
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  xp: user.xp,
  level: user.level,
  streak: user.streak,
  badges: user.badges,
  isVerified: user.isVerified,
});


// ================= REGISTER =================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !password) {
      return res.status(400).json({
        message: "Name and password are required",
      });
    }

    const emailCheck = validateEmail(email);

    if (!emailCheck.valid) {
      return res.status(400).json({
        message: emailCheck.reason,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing && existing.isVerified) {
      return res.status(400).json({
        message:
          "An account with this email already exists",
      });
    }

    const otp = generateOTP();

    const otpHash = hashOTP(otp);

    const otpExpiresAt = new Date(
      Date.now() +
        OTP_EXPIRY_MINUTES *
          60 *
          1000
    );

    let user;

    if (existing && !existing.isVerified) {
      existing.name = name.trim();

      existing.password = password;

      existing.otpCode = otpHash;

      existing.otpExpiresAt = otpExpiresAt;

      existing.otpAttempts = 0;

      existing.otpLastSentAt =
        new Date();

      user = await existing.save();
    } else {
      user = await User.create({
        name: name.trim(),

        email: normalizedEmail,

        password,

        otpCode: otpHash,

        otpExpiresAt,

        otpLastSentAt:
          new Date(),
      });
    }

    const emailSent =
      await sendOTPEmail(
        user.email,
        {
          name: user.name,

          otp,

          expiryMinutes:
            OTP_EXPIRY_MINUTES,
        }
      );

    if (!emailSent) {
      return res.status(502).json({
        message:
          "Email could not be sent",
      });
    }

    res.status(201).json({
      message:
        "Account created. Check your email for OTP.",

      email: user.email,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= VERIFY OTP =================

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message:
          "Email and OTP required",
      });
    }

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      }).select(
        "+otpCode +otpExpiresAt +otpAttempts"
      );

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid request",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "Already verified",
      });
    }

    if (
      user.otpExpiresAt <
      new Date()
    ) {
      return res.status(400).json({
        message:
          "OTP expired",
      });
    }

    if (
      user.otpAttempts >=
      OTP_MAX_ATTEMPTS
    ) {
      return res.status(429).json({
        message:
          "Too many attempts",
      });
    }

    if (
      hashOTP(otp) !==
      user.otpCode
    ) {
      user.otpAttempts++;

      await user.save();

      return res.status(400).json({
        message:
          "Incorrect OTP",
      });
    }

    user.isVerified = true;

    user.otpCode = undefined;

    user.otpExpiresAt =
      undefined;

    user.otpAttempts = 0;

    await user.save();

    sendWelcomeEmail(
      user.email,
      {
        name: user.name,
      }
    );

    res.json({
      ...publicUser(user),

      token:
        generateToken(
          user._id
        ),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= RESEND OTP =================

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      }).select(
        "+otpLastSentAt"
      );

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid request",
      });
    }

    const otp =
      generateOTP();

    user.otpCode =
      hashOTP(otp);

    user.otpExpiresAt =
      new Date(
        Date.now() +
          OTP_EXPIRY_MINUTES *
            60 *
            1000
      );

    user.otpAttempts = 0;

    user.otpLastSentAt =
      new Date();

    await user.save();

    await sendOTPEmail(
      user.email,
      {
        name: user.name,

        otp,

        expiryMinutes:
          OTP_EXPIRY_MINUTES,
      }
    );

    res.json({
      message:
        "OTP sent again",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email: email
          .trim()
          .toLowerCase(),
      }).select("+password");

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    const isMatch =
      await user.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Verify email first",

        needsVerification: true,

        email: user.email,
      });
    }

    res.json({
      ...publicUser(user),

      token:
        generateToken(
          user._id
        ),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ================= GET ME =================

const getMe = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,

  verifyOTP,

  resendOTP,

  loginUser,

  getMe,
};