const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getMe,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many attempts. Please try again later.",
  },
});

router.post("/register", authLimiter, registerUser);

router.post("/verify-otp", authLimiter, verifyOTP);

router.post("/resend-otp", authLimiter, resendOTP);

router.post("/login", authLimiter, loginUser);

router.get("/me", protect, getMe);

module.exports = router;