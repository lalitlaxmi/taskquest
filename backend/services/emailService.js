const transporter = require("../config/mailer");
const {
  otpEmailTemplate,
  welcomeEmailTemplate,
  taskReminderTemplate,
  streakReminderTemplate,
  inactivityReminderTemplate,
  weeklyReportTemplate,
} = require("../templates/emailTemplates");

const FROM = `"${process.env.EMAIL_FROM_NAME || "TaskQuest"}" <${process.env.EMAIL_USER}>`;

/**
 * Generic send wrapper. Never throws to the caller for non-critical mail
 * (reminders) — logs instead, so a flaky SMTP provider can't crash a request.
 * For critical mail (OTP), the caller should check the return value.
 */
async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    return true;
  } catch (err) {
    console.error(`✉️  Failed to send mail to ${to}:`, err.message);
    return false;
  }
}

const sendOTPEmail = (to, { name, otp, expiryMinutes }) =>
  sendMail({
    to,
    subject: `${otp} is your TaskQuest verification code`,
    html: otpEmailTemplate({ name, otp, expiryMinutes }),
  });

const sendWelcomeEmail = (to, { name }) =>
  sendMail({
    to,
    subject: "Welcome to TaskQuest 🚀",
    html: welcomeEmailTemplate({ name }),
  });

const sendTaskReminderEmail = (to, { name, taskTitle, dueDate }) =>
  sendMail({
    to,
    subject: `⏰ "${taskTitle}" is due soon`,
    html: taskReminderTemplate({ name, taskTitle, dueDate }),
  });

const sendStreakReminderEmail = (to, { name, streak }) =>
  sendMail({
    to,
    subject: `🔥 Keep your ${streak}-day streak alive`,
    html: streakReminderTemplate({ name, streak }),
  });

const sendInactivityReminderEmail = (to, { name }) =>
  sendMail({
    to,
    subject: "We miss you on TaskQuest 👀",
    html: inactivityReminderTemplate({ name }),
  });

const sendWeeklyReportEmail = (to, data) =>
  sendMail({
    to,
    subject: "📊 Your TaskQuest weekly report",
    html: weeklyReportTemplate(data),
  });

module.exports = {
  sendMail,
  sendOTPEmail,
  sendWelcomeEmail,
  sendTaskReminderEmail,
  sendStreakReminderEmail,
  sendInactivityReminderEmail,
  sendWeeklyReportEmail,
};
