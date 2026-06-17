const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // OTP Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    otpCode: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    otpLastSentAt: {
      type: Date,
      select: false,
    },

    // Gamification
    xp: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streak: {
      type: Number,
      default: 0,
    },

    lastActiveDate: {
      type: Date,
      default: null,
    },

    badges: {
      type: [String],
      default: [],
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastReminderSentAt: {
      type: Date,
      default: null,
    },

    lastWeeklyReportAt: {
      type: Date,
      default: null,
    },

    emailPreferences: {
      taskReminders: {
        type: Boolean,
        default: true,
      },

      streakReminders: {
        type: Boolean,
        default: true,
      },

      weeklyReports: {
        type: Boolean,
        default: true,
      },

      motivational: {
        type: Boolean,
        default: true,
      },
    },
  },

  { timestamps: true }
);

// HASH PASSWORD

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// MATCH PASSWORD

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields

userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.otpCode;
  delete obj.otpExpiresAt;
  delete obj.otpAttempts;
  delete obj.otpLastSentAt;

  return obj;
};

module.exports = mongoose.model("User", userSchema);