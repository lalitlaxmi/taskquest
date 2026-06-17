/**
 * All templates share a minimal inline-styled layout because email clients
 * (Outlook, Gmail) strip <style> blocks and external CSS unreliably.
 */

function baseLayout(bodyHtml) {
  return `
  <div style="background:#0A0E1A;padding:40px 20px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#111827;border:1px solid #2D3748;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#7C3AED,#06B6D4);padding:24px;text-align:center;">
        <span style="font-size:20px;font-weight:700;color:#fff;">Task<span style="color:#1a1a2e;">Quest</span></span>
      </div>
      <div style="padding:32px;color:#E2E8F0;">
        ${bodyHtml}
      </div>
      <div style="padding:16px 32px;border-top:1px solid #2D3748;text-align:center;">
        <p style="font-size:12px;color:#64748B;margin:0;">
          You're receiving this because you have a TaskQuest account.
        </p>
      </div>
    </div>
  </div>`;
}

function otpEmailTemplate({ name, otp, expiryMinutes }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">Verify your email, ${name} 👋</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Enter this code to verify your account and start earning XP.
    </p>
    <div style="background:#1E2535;border:1px solid #2D3748;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#A78BFA;font-family:monospace;">${otp}</span>
    </div>
    <p style="color:#64748B;font-size:13px;margin:0;">
      This code expires in ${expiryMinutes} minutes. If you didn't request this, ignore this email.
    </p>
  `);
}

function welcomeEmailTemplate({ name }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">Welcome aboard, ${name}! 🚀</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 16px;">
      Your account is verified and ready. Here's how to get the most out of TaskQuest:
    </p>
    <ul style="color:#CBD5E1;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 20px;">
      <li>Create your first task and pick a difficulty for bonus XP</li>
      <li>Complete tasks daily to build your streak 🔥</li>
      <li>Unlock badges as you level up</li>
    </ul>
    <p style="color:#64748B;font-size:13px;margin:0;">Let's get productive.</p>
  `);
}

function taskReminderTemplate({ name, taskTitle, dueDate }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">⏰ Task due soon</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 16px;">
      Hey ${name}, your task is approaching its deadline:
    </p>
    <div style="background:#1E2535;border:1px solid #2D3748;border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="margin:0;color:#fff;font-weight:600;">${taskTitle}</p>
      <p style="margin:4px 0 0;color:#F59E0B;font-size:13px;">Due: ${dueDate}</p>
    </div>
    <p style="color:#64748B;font-size:13px;margin:0;">Complete it now to keep your streak alive.</p>
  `);
}

function streakReminderTemplate({ name, streak }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">🔥 Don't lose your streak!</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 16px;">
      ${name}, you're on a <strong style="color:#F59E0B;">${streak}-day streak</strong>.
      Complete one task today to keep it going.
    </p>
  `);
}

function inactivityReminderTemplate({ name }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">We miss you, ${name} 👀</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 16px;">
      It's been a few days since your last task. Your progress is still saved —
      jump back in and keep leveling up.
    </p>
  `);
}

function weeklyReportTemplate({ name, tasksCompleted, xpEarned, currentStreak }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">📊 Your week in review</h2>
    <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin:0 0 20px;">Nice work this week, ${name}.</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <tr>
        <td style="padding:12px;background:#1E2535;border-radius:8px 0 0 8px;text-align:center;">
          <p style="margin:0;color:#06B6D4;font-size:24px;font-weight:700;">${tasksCompleted}</p>
          <p style="margin:4px 0 0;color:#64748B;font-size:12px;">Tasks done</p>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:12px;background:#1E2535;text-align:center;">
          <p style="margin:0;color:#A78BFA;font-size:24px;font-weight:700;">${xpEarned}</p>
          <p style="margin:4px 0 0;color:#64748B;font-size:12px;">XP earned</p>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:12px;background:#1E2535;border-radius:0 8px 8px 0;text-align:center;">
          <p style="margin:0;color:#F59E0B;font-size:24px;font-weight:700;">${currentStreak}</p>
          <p style="margin:4px 0 0;color:#64748B;font-size:12px;">Day streak</p>
        </td>
      </tr>
    </table>
    <p style="color:#64748B;font-size:13px;margin:0;">Keep the momentum going next week.</p>
  `);
}

module.exports = {
  otpEmailTemplate,
  welcomeEmailTemplate,
  taskReminderTemplate,
  streakReminderTemplate,
  inactivityReminderTemplate,
  weeklyReportTemplate,
};
