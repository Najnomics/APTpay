import { Context } from 'telegraf';

export const showHelp = async (ctx: Context) => {
  const helpMessage = `
🚀 *APTpay Telegram Bot - Help*

🎛️ *Available Commands:*

💼 *Payroll Management:*
• \`/dashboard\` - Main dashboard overview
• \`/employees\` - View employee list
• \`/payroll\` - Execute payroll operations
• \`/add_employee\` - Add new employee

💰 *Treasury Operations:*
• \`/treasury\` - Treasury overview & analytics
• \`/deposit\` - Deposit funds to treasury
• \`/withdraw\` - Withdraw for payroll

🌍 *Foreign Exchange:*
• \`/forex\` - Currency exchange rates
• \`/swap\` - Execute currency swaps

⚙️ *System & Security:*
• \`/settings\` - Bot preferences
• \`/security\` - Security status & logs
• \`/notifications\` - Notification settings

📊 *Analytics & Reports:*
• \`/analytics\` - Detailed platform analytics
• \`/reports\` - Generate custom reports

❓ *Support:*
• \`/help\` - Show this help message
• \`/status\` - System status check

🔐 *Security Note:*
All sensitive operations require multi-signature approval and are logged for audit purposes.

📱 *Quick Actions:*
Use the inline buttons for faster navigation!
  `;

  await ctx.reply(helpMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎛️ Dashboard', callback_data: 'dashboard' }],
        [{ text: '💼 Payroll', callback_data: 'payroll' }, { text: '💰 Treasury', callback_data: 'treasury' }],
        [{ text: '🌍 Forex', callback_data: 'forex' }, { text: '⚙️ Settings', callback_data: 'settings' }]
      ]
    }
  });
};