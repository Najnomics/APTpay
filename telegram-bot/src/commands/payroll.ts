import { Context } from 'telegraf';
import { aptosService } from '../services/aptosService';
import { payrollService } from '../services/payrollService';

export const payrollCommands = {
  async showDashboard(ctx: Context) {
    try {
      const dashboardData = await payrollService.getDashboardData();
      
      const message = `
📊 *APTpay Dashboard*

💰 *Treasury Balance:* ${dashboardData.treasuryBalance.toLocaleString()} USDC
👥 *Total Employees:* ${dashboardData.totalEmployees}
💸 *Monthly Payroll:* ${dashboardData.monthlyPayroll.toLocaleString()} USDC
📈 *Yield Earned:* ${dashboardData.yieldEarned.toLocaleString()} USDC
🌍 *Countries:* ${dashboardData.countries}

*Recent Activity:*
${dashboardData.recentTransactions.map(tx => 
  `• ${tx.employee}: ${tx.amount} ${tx.currency} (${tx.status})`
).join('\n')}

*System Status:* ✅ All systems operational
*Last Update:* ${new Date().toLocaleString()}
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💸 Execute Payroll', callback_data: 'execute_payroll' },
              { text: '👥 Manage Employees', callback_data: 'employees' }
            ],
            [
              { text: '💰 Treasury', callback_data: 'treasury' },
              { text: '🌍 Forex', callback_data: 'forex' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to load dashboard data. Please try again later.');
    }
  },

  async showEmployees(ctx: Context) {
    try {
      const employees = await payrollService.getEmployees();
      
      let message = `👥 *Employee Management*\n\n`;
      
      if (employees.length === 0) {
        message += 'No employees found. Use /addemployee to add your first employee.';
      } else {
        employees.forEach((emp, index) => {
          message += `*${index + 1}. ${emp.name}*\n`;
          message += `📍 ${emp.country}\n`;
          message += `💰 ${emp.salary.toLocaleString()} ${emp.currency}\n`;
          message += `🏠 ${emp.address.substring(0, 8)}...${emp.address.substring(emp.address.length - 8)}\n`;
          message += `📅 Last Paid: ${emp.lastPaid}\n\n`;
        });
      }

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '➕ Add Employee', callback_data: 'add_employee' },
              { text: '📝 Edit Employee', callback_data: 'edit_employee' }
            ],
            [
              { text: '💸 Execute Payroll', callback_data: 'execute_payroll' },
              { text: '📊 Export List', callback_data: 'export_employees' }
            ],
            [
              { text: '🔙 Back to Dashboard', callback_data: 'dashboard' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to load employees. Please try again later.');
    }
  },

  async addEmployee(ctx: Context) {
    await ctx.reply(`
👤 *Add New Employee*

Please provide the following information in this format:

\`\`\`
Name: [Employee Name]
Address: [Wallet Address]
Salary: [Amount in USDC]
Currency: [USDC/EURc/GBPc/JPYc]
Country: [Country Name]
\`\`\`

*Example:*
\`\`\`
Name: Alice Johnson
Address: 0x1234...5678
Salary: 5000
Currency: USDC
Country: United States
\`\`\`

Send the information and I'll add the employee to your payroll system.
    `, { parse_mode: 'Markdown' });
  },

  async executePayroll(ctx: Context) {
    try {
      const employees = await payrollService.getEmployees();
      
      if (employees.length === 0) {
        await ctx.reply('❌ No employees found. Please add employees first using /addemployee');
        return;
      }

      const totalAmount = employees.reduce((sum, emp) => sum + emp.salary, 0);
      
      const message = `
💸 *Execute Payroll*

*Summary:*
👥 Employees: ${employees.length}
💰 Total Amount: ${totalAmount.toLocaleString()} USDC
🌍 Countries: ${new Set(employees.map(e => e.country)).size}
⚡ Processing: Parallel execution (1000+ employees supported)

*Employees to be paid:*
${employees.map((emp, index) => 
  `${index + 1}. ${emp.name}: ${emp.salary.toLocaleString()} ${emp.currency}`
).join('\n')}

⚠️ *This action cannot be undone. Please verify all details.*

Ready to execute payroll?
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Confirm & Execute', callback_data: 'confirm_payroll' },
              { text: '❌ Cancel', callback_data: 'cancel_payroll' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to prepare payroll. Please try again later.');
    }
  },

  async confirmPayroll(ctx: Context) {
    try {
      await ctx.reply('⏳ Executing payroll... This may take a few moments.');
      
      const result = await payrollService.executePayroll();
      
      if (result.success) {
        const message = `
✅ *Payroll Executed Successfully!*

📊 *Transaction Details:*
🔗 Transaction Hash: \`${result.transactionHash}\`
💰 Total Amount: ${result.totalAmount.toLocaleString()} USDC
👥 Employees Paid: ${result.employeeCount}
⏱️ Execution Time: ${result.executionTime}ms
💸 Gas Used: ${result.gasUsed} APT

*Individual Payments:*
${result.payments.map((payment, index) => 
  `${index + 1}. ${payment.employee}: ${payment.amount} ${payment.currency} ✅`
).join('\n')}

🎉 All employees have been paid successfully!
        `;

        await ctx.replyWithMarkdown(message);
      } else {
        await ctx.reply(`❌ Payroll execution failed: ${result.error}`);
      }
    } catch (error) {
      await ctx.reply('❌ Failed to execute payroll. Please try again later.');
    }
  },

  async showForex(ctx: Context) {
    try {
      const forexData = await payrollService.getForexData();
      
      const message = `
🌍 *Forex Module*

*Supported Pairs:*
${forexData.pairs.map(pair => 
  `• ${pair.base}/${pair.quote}: ${pair.rate} (${pair.change24h >= 0 ? '+' : ''}${pair.change24h}%)`
).join('\n')}

*24h Volume:* ${forexData.volume24h.toLocaleString()} USDC
*Active DEXs:* ${forexData.activeDexs}
*Success Rate:* ${forexData.successRate}%

*Best Rates:*
• USDC → EURc: ${forexData.pairs.find(p => p.base === 'USDC' && p.quote === 'EURc')?.rate} (Tapp)
• USDC → GBPc: ${forexData.pairs.find(p => p.base === 'USDC' && p.quote === 'GBPc')?.rate} (Hyperion)

Use /swap to exchange currencies.
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💱 Quick Swap', callback_data: 'quick_swap' },
              { text: '📊 View Rates', callback_data: 'view_rates' }
            ],
            [
              { text: '🔙 Back to Dashboard', callback_data: 'dashboard' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to load forex data. Please try again later.');
    }
  },

  async swapCurrency(ctx: Context) {
    await ctx.reply(`
💱 *Currency Swap*

Please provide the swap details in this format:

\`\`\`
From: [Currency Code]
To: [Currency Code]
Amount: [Amount to swap]
\`\`\`

*Example:*
\`\`\`
From: USDC
To: EURc
Amount: 1000
\`\`\`

*Available currencies:* USDC, EURc, GBPc, JPYc

I'll find the best rate and execute the swap for you.
    `, { parse_mode: 'Markdown' });
  }
};
