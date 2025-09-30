import { Telegraf, Context } from 'telegraf';
import dotenv from 'dotenv';
import { showTreasury, showTreasuryAnalytics } from './commands/treasury';
import { showHelp } from './commands/help';
import { AptosService } from './services/aptosService';
import { PayrollService } from './services/payrollService';
import { NotificationService } from './services/notificationService';

// Load environment variables
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN || 'demo_token');

// Initialize services
const aptosService = new AptosService();
const payrollService = new PayrollService();
const notificationService = new NotificationService();

// Middleware for authentication and logging
bot.use(async (ctx: Context, next) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username;
  
  console.log(`[${new Date().toISOString()}] User ${userId} (@${username})`);
  
  await next();
});

// Start command
bot.start(async (ctx) => {
  const welcomeMessage = `
🚀 *Welcome to APTpay Bot!*

I'm your assistant for managing cross-border payroll on Aptos blockchain.

*What I can help you with:*
💰 Treasury management
👥 Employee payroll
🌍 Forex operations
📊 Performance analytics
🔔 Notifications

Use /help to see all available commands.

*Quick Start:*
1. Connect your wallet
2. Set up your team
3. Execute payroll payments

*APTpay* - Pay anyone, anywhere, instantly! 🌍⚡
  `;
  
  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 Dashboard', callback_data: 'dashboard' },
          { text: '💰 Treasury', callback_data: 'treasury' }
        ],
        [
          { text: '👥 Employees', callback_data: 'employees' },
          { text: '🌍 Forex', callback_data: 'forex' }
        ],
        [
          { text: '⚙️ Settings', callback_data: 'settings' },
          { text: '❓ Help', callback_data: 'help' }
        ]
      ]
    }
  });
});

// Help command
bot.help(async (ctx) => {
  await showHelp(ctx);
});

// Dashboard command
bot.command('dashboard', async (ctx) => {
  const dashboardData = await payrollService.getDashboardData();
  
  const message = `
📊 *APTpay Dashboard*

👥 *Employees:* ${dashboardData.employeeCount}
💰 *Treasury Balance:* ${dashboardData.treasuryBalance}
📈 *Active Yield:* ${dashboardData.activeYield}
📅 *Next Payroll:* ${dashboardData.nextPayroll}
🟢 *Status:* ${dashboardData.systemStatus}

_Last updated: ${new Date().toLocaleTimeString()}_
  `;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '💼 Payroll', callback_data: 'payroll' }, { text: '💰 Treasury', callback_data: 'treasury' }],
        [{ text: '📊 Analytics', callback_data: 'analytics' }, { text: '⚙️ Settings', callback_data: 'settings' }]
      ]
    }
  });
});

// Treasury command
bot.command('treasury', async (ctx) => {
  await showTreasury(ctx);
});

// Employees command
bot.command('employees', async (ctx) => {
  const employees = await payrollService.getEmployeeList();
  
  let message = '👥 *Employee List*\n\n';
  employees.forEach((emp, index) => {
    message += `${index + 1}. *${emp.name}*\n`;
    message += `   └ ${emp.role} - ${emp.salary}\n`;
    message += `   └ Status: ${emp.status}\n\n`;
  });

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Add Employee', callback_data: 'add_employee' }],
        [{ text: '💼 Execute Payroll', callback_data: 'execute_payroll' }],
        [{ text: '🔙 Back to Dashboard', callback_data: 'dashboard' }]
      ]
    }
  });
});

// Callback query handler
bot.on('callback_query', async (ctx) => {
  const data = (ctx.callbackQuery as any).data;
  
  switch (data) {
    case 'dashboard':
      await ctx.answerCbQuery();
      const dashboardData = await payrollService.getDashboardData();
      
      const message = `
📊 *APTpay Dashboard*

👥 *Employees:* ${dashboardData.employeeCount}
💰 *Treasury Balance:* ${dashboardData.treasuryBalance}
📈 *Active Yield:* ${dashboardData.activeYield}
📅 *Next Payroll:* ${dashboardData.nextPayroll}
🟢 *Status:* ${dashboardData.systemStatus}

_Last updated: ${new Date().toLocaleTimeString()}_
      `;

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '💼 Payroll', callback_data: 'payroll' }, { text: '💰 Treasury', callback_data: 'treasury' }],
            [{ text: '📊 Analytics', callback_data: 'analytics' }, { text: '⚙️ Settings', callback_data: 'settings' }]
          ]
        }
      });
      break;

    case 'treasury':
      await ctx.answerCbQuery();
      await showTreasury(ctx);
      break;

    case 'treasury_analytics':
      await ctx.answerCbQuery();
      await showTreasuryAnalytics(ctx);
      break;

    case 'help':
      await ctx.answerCbQuery();
      await showHelp(ctx);
      break;

    case 'employees':
      await ctx.answerCbQuery();
      const employees = await payrollService.getEmployeeList();
      
      let employeeMessage = '👥 *Employee List*\n\n';
      employees.forEach((emp, index) => {
        employeeMessage += `${index + 1}. *${emp.name}*\n`;
        employeeMessage += `   └ ${emp.role} - ${emp.salary}\n`;
        employeeMessage += `   └ Status: ${emp.status}\n\n`;
      });

      await ctx.editMessageText(employeeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '➕ Add Employee', callback_data: 'add_employee' }],
            [{ text: '💼 Execute Payroll', callback_data: 'execute_payroll' }],
            [{ text: '🔙 Back to Dashboard', callback_data: 'dashboard' }]
          ]
        }
      });
      break;

    case 'execute_payroll':
      await ctx.answerCbQuery();
      const payrollStatus = await payrollService.getPayrollStatus();
      
      const payrollMessage = `
💼 *Payroll Execution*

📅 *Last Payroll:* ${payrollStatus.lastPayroll}
📅 *Next Scheduled:* ${payrollStatus.nextPayroll}
💰 *Pending Amount:* ${payrollStatus.pendingAmount}
👥 *Employees:* ${payrollStatus.employeesCount}

✅ *Ready to Execute:* ${payrollStatus.readyToExecute ? 'Yes' : 'No'}

⚠️ *Note:* Payroll execution requires multi-sig approval
      `;

      await ctx.editMessageText(payrollMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Confirm Execute', callback_data: 'confirm_payroll' }],
            [{ text: '📊 View Details', callback_data: 'payroll_details' }],
            [{ text: '🔙 Back to Dashboard', callback_data: 'dashboard' }]
          ]
        }
      });
      break;

    case 'confirm_payroll':
      await ctx.answerCbQuery();
      await notificationService.sendPayrollNotification(ctx, '36,200 USDC', 5);
      break;

    default:
      await ctx.answerCbQuery('Feature coming soon!');
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('Sorry, an error occurred. Please try again later.');
});

// Start the bot
if (process.env.BOT_TOKEN && process.env.BOT_TOKEN !== 'demo_token') {
  bot.launch();
  console.log('🚀 APTpay Telegram Bot started successfully!');
  console.log('📱 Ready to process commands...');
} else {
  console.log('⚠️  Bot token not provided. Running in demo mode.');
  console.log('📱 Set BOT_TOKEN in .env file to enable Telegram bot.');
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));