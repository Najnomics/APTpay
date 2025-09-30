import { Context } from 'telegraf';

export class NotificationService {
  private subscribers: Set<number> = new Set();

  addSubscriber(chatId: number) {
    this.subscribers.add(chatId);
  }

  removeSubscriber(chatId: number) {
    this.subscribers.delete(chatId);
  }

  async sendPayrollNotification(ctx: Context, amount: string, employeeCount: number) {
    const message = `
🎉 *Payroll Executed Successfully!*

💰 *Total Amount:* ${amount}
👥 *Employees Paid:* ${employeeCount}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Time:* ${new Date().toLocaleTimeString()}

✅ All payments have been processed and confirmed on the blockchain.
🔐 Transaction details logged for audit purposes.

_Next payroll scheduled for next month_
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async sendTreasuryAlert(ctx: Context, alertType: string, details: string) {
    const message = `
🚨 *Treasury Alert: ${alertType}*

📊 *Details:* ${details}
📅 *Timestamp:* ${new Date().toLocaleString()}

🔍 Please review treasury operations and take appropriate action if needed.
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async sendSecurityAlert(ctx: Context, event: string) {
    const message = `
🔒 *Security Alert*

⚠️ *Event:* ${event}
📅 *Timestamp:* ${new Date().toLocaleString()}

🔐 System security protocols activated. Please verify if this action was authorized.
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async sendYieldUpdate(ctx: Context, newAPY: string, oldAPY: string) {
    const message = `
📈 *Yield Strategy Update*

🎯 *New APY:* ${newAPY}
📊 *Previous APY:* ${oldAPY}
📅 *Effective Date:* ${new Date().toLocaleDateString()}

💡 Treasury yield optimization has been updated based on market conditions.
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }

  async sendMaintenanceNotice(ctx: Context, startTime: string, duration: string) {
    const message = `
🔧 *Scheduled Maintenance Notice*

⏰ *Start Time:* ${startTime}
⏱️ *Duration:* ${duration}

🛠️ During this time, some features may be temporarily unavailable.
📱 You'll receive a notification when maintenance is complete.
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }
}