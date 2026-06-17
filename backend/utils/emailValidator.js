/**
 * Blocks the most common disposable / temp-mail domains so fake signups
 * can't easily farm OTPs. This list is intentionally focused on the
 * highest-traffic temp-mail providers — for a larger production app you'd
 * swap this for a maintained API like Kickbox or Mailgun's validation API.
 */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "10minutemail.net",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamail.biz",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "sharklasers.com",
  "maildrop.cc",
  "mintemail.com",
  "dispostable.com",
  "mailcatch.com",
  "moakt.com",
  "emailondeck.com",
  "tempinbox.com",
  "spambog.com",
  "mailnesia.com",
  "tempmailo.com",
  "luxusmail.org",
  "byom.de",
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format and rejects known disposable domains.
 * Returns { valid: boolean, reason?: string }
 */
function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email is required" };
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, reason: "Invalid email format" };
  }

  const domain = trimmed.split("@")[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      reason: "Disposable or temporary email addresses are not allowed",
    };
  }

  return { valid: true };
}

module.exports = { validateEmail, DISPOSABLE_DOMAINS };
