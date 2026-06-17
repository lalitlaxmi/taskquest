const crypto = require("crypto");

/** Generates a 6-digit numeric OTP as a string, e.g. "048213" */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/** Hashes the OTP before storing — so a leaked DB doesn't expose live OTPs */
function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/** OTP validity window in minutes */
const OTP_EXPIRY_MINUTES = 10;

/** Minimum seconds a user must wait before requesting another OTP */
const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** Max wrong attempts before the OTP is invalidated and a new one is required */
const OTP_MAX_ATTEMPTS = 5;

module.exports = {
  generateOTP,
  hashOTP,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_MAX_ATTEMPTS,
};
