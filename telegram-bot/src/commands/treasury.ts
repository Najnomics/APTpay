import { Context } from 'telegraf';

export const showTreasury = async (ctx: Context) => {
  const treasuryData = {
    totalBalance: '1,250,000 USDC',
    activeYield: '4.2%',
    monthlyIncome: '4,375 USDC',
    totalYield: '52,500 USDC'
  };

  const message = `
💰 *Treasury Overview*

📊 *Total Balance:* ${treasuryData.totalBalance}
📈 *Active Yield:* ${treasuryData.activeYield} APY
💸 *Monthly Income:* ${treasuryData.monthlyIncome}
🎯 *Total Yield Earned:* ${treasuryData.totalYield}

🔐 *Security Status:* ✅ All systems secure
🏦 *Strategy:* Conservative DeFi Yield Farming
⚡ *Next Optimization:* In 7 days

_Treasury operations require multi-sig approval_
  `;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '📊 Detailed Analytics', callback_data: 'treasury_analytics' }],
        [{ text: '💰 Deposit Funds', callback_data: 'treasury_deposit' }],
        [{ text: '🔄 Change Strategy', callback_data: 'treasury_strategy' }],
        [{ text: '🔙 Back to Dashboard', callback_data: 'dashboard' }]
      ]
    }
  });
};

export const showTreasuryAnalytics = async (ctx: Context) => {
  const analyticsMessage = `
📊 *Treasury Analytics (Last 30 Days)*

📈 *Performance Metrics:*
• APY: 4.2% (vs 3.8% benchmark)
• Volatility: 0.3% (Low Risk)
• Sharpe Ratio: 2.1 (Excellent)

💹 *Yield Sources:*
• Aave Lending: 45% (2.1% APY)
• Compound: 35% (1.8% APY)  
• Curve LP: 20% (3.2% APY)

🎯 *Risk Analysis:*
• Smart Contract Risk: Low
• Liquidity Risk: Very Low
• Market Risk: Low

📅 *Next Actions:*
• Rebalancing scheduled: Oct 5
• Strategy review: Oct 10
  `;

  await ctx.reply(analyticsMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔙 Back to Treasury', callback_data: 'treasury' }]
      ]
    }
  });
};