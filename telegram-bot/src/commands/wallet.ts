import { Context } from 'telegraf';
import { aptosService } from '../services/aptosService';
import { QRCodeService } from '../services/qrCodeService';

export const walletCommands = {
  async connectWallet(ctx: Context) {
    try {
      const sessionId = `aptpay_${ctx.from?.id}_${Date.now()}`;
      const connectUrl = `https://aptpay.app/connect?session=${sessionId}`;
      
      // Generate QR code for wallet connection
      const qrCode = await QRCodeService.generateQR(connectUrl);
      
      const message = `
🔗 *Connect Your Wallet*

Scan this QR code with your Aptos wallet app or click the link below:

📱 *Mobile:* Open your wallet app and scan
💻 *Desktop:* Click the connect button below

*Session ID:* \`${sessionId}\`
*Valid for:* 5 minutes

⚠️ Only connect wallets you trust and control
      `;

      await ctx.replyWithPhoto(
        { source: qrCode },
        {
          caption: message,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔗 Connect Wallet', url: connectUrl },
                { text: '📱 Copy Link', callback_data: `copy_${sessionId}` }
              ],
              [
                { text: '❓ Wallet Help', callback_data: 'wallet_help' },
                { text: '🔄 Generate New QR', callback_data: 'new_qr' }
              ],
              [
                { text: '🔙 Back to Dashboard', callback_data: 'dashboard' }
              ]
            ]
          }
        }
      );

      // Store session for 5 minutes
      setTimeout(() => {
        // Clean up expired session
      }, 5 * 60 * 1000);

    } catch (error) {
      await ctx.reply('❌ Failed to generate wallet connection. Please try again.');
    }
  },

  async showWalletStatus(ctx: Context) {
    try {
      const userId = ctx.from?.id;
      const walletData = await aptosService.getWalletStatus(userId);

      if (!walletData.connected) {
        const message = `
🔐 *Wallet Status*

*Status:* ❌ Not Connected
*Security Level:* No wallet linked

To connect your wallet:
1. Use /connectwallet command
2. Scan QR code with your Aptos wallet
3. Approve the connection

*Supported Wallets:*
• Petra Wallet
• Martian Wallet
• Fewcha Wallet
• Pontem Wallet
        `;

        await ctx.replyWithMarkdown(message, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🔗 Connect Wallet', callback_data: 'connect_wallet' },
                { text: '❓ Wallet Help', callback_data: 'wallet_help' }
              ],
              [
                { text: '🔙 Back to Dashboard', callback_data: 'dashboard' }
              ]
            ]
          }
        });
      } else {
        const message = `
🔐 *Wallet Status*

*Status:* ✅ Connected
*Address:* \`${walletData.address}\`
*Balance:* ${walletData.balance} APT
*Network:* ${walletData.network}
*Connected:* ${walletData.connectedAt}

*Security Features:*
✅ Multi-signature protection
✅ Transaction approval required
✅ Encrypted communication
✅ Session-based authentication

*Recent Activity:*
${walletData.recentTx.map(tx => 
  `• ${tx.type}: ${tx.amount} (${tx.status})`
).join('\n')}
        `;

        await ctx.replyWithMarkdown(message, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '💰 View Balance', callback_data: 'wallet_balance' },
                { text: '📊 Transaction History', callback_data: 'wallet_history' }
              ],
              [
                { text: '⚙️ Wallet Settings', callback_data: 'wallet_settings' },
                { text: '🔄 Refresh', callback_data: 'wallet_refresh' }
              ],
              [
                { text: '🔐 Disconnect', callback_data: 'wallet_disconnect' },
                { text: '🔙 Back', callback_data: 'dashboard' }
              ]
            ]
          }
        });
      }
    } catch (error) {
      await ctx.reply('❌ Failed to fetch wallet status. Please try again.');
    }
  },

  async showWalletBalance(ctx: Context) {
    try {
      const userId = ctx.from?.id;
      const balanceData = await aptosService.getWalletBalance(userId);

      const message = `
💰 *Wallet Balance*

*APT Balance:* ${balanceData.apt} APT
*USD Value:* $${balanceData.usdValue}

*Token Balances:*
${balanceData.tokens.map(token => 
  `• ${token.symbol}: ${token.balance} (${token.usdValue})`
).join('\n')}

*Total Portfolio:* $${balanceData.totalUSD}
*24h Change:* ${balanceData.change24h >= 0 ? '+' : ''}${balanceData.change24h}%

*Staking Rewards:*
• Available: ${balanceData.stakingRewards} APT
• Pending: ${balanceData.pendingRewards} APT

*Last Updated:* ${new Date().toLocaleString()}
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📤 Send APT', callback_data: 'send_apt' },
              { text: '📥 Receive APT', callback_data: 'receive_apt' }
            ],
            [
              { text: '💱 Swap Tokens', callback_data: 'swap_tokens' },
              { text: '🏦 Stake APT', callback_data: 'stake_apt' }
            ],
            [
              { text: '🔄 Refresh Balance', callback_data: 'wallet_refresh' },
              { text: '🔙 Back', callback_data: 'wallet_status' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to fetch wallet balance. Please try again.');
    }
  },

  async showTransactionHistory(ctx: Context) {
    try {
      const userId = ctx.from?.id;
      const history = await aptosService.getTransactionHistory(userId, 10);

      let message = `📊 *Transaction History*\n\n`;
      
      if (history.length === 0) {
        message += 'No transactions found.';
      } else {
        history.forEach((tx, index) => {
          const statusIcon = tx.status === 'success' ? '✅' : 
                           tx.status === 'pending' ? '⏳' : '❌';
          
          message += `*${index + 1}. ${tx.type}* ${statusIcon}\n`;
          message += `💰 Amount: ${tx.amount} ${tx.token}\n`;
          message += `⛽ Gas: ${tx.gasUsed} APT\n`;
          message += `📅 ${tx.timestamp}\n`;
          message += `🔗 \`${tx.hash.substring(0, 16)}...\`\n\n`;
        });
      }

      message += `\n*Total Transactions:* ${history.length}`;
      message += `\n*Last Updated:* ${new Date().toLocaleString()}`;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📤 Send Transaction', callback_data: 'send_transaction' },
              { text: '🔍 View Details', callback_data: 'tx_details' }
            ],
            [
              { text: '📊 Export History', callback_data: 'export_history' },
              { text: '🔄 Refresh', callback_data: 'wallet_history' }
            ],
            [
              { text: '🔙 Back to Wallet', callback_data: 'wallet_status' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to fetch transaction history. Please try again.');
    }
  },

  async sendTransaction(ctx: Context) {
    await ctx.reply(`
📤 *Send APT or Tokens*

Please provide the transaction details in this format:

\`\`\`
To: [Recipient Address]
Amount: [Amount to send]
Token: [APT/USDC/etc]
Memo: [Optional memo]
\`\`\`

*Example:*
\`\`\`
To: 0x1234...5678
Amount: 10
Token: APT
Memo: Payment for services
\`\`\`

⚠️ *Important:*
• Double-check the recipient address
• Transaction fees will be deducted
• This action requires wallet approval

Send the transaction details and I'll prepare it for signing.
    `, { parse_mode: 'Markdown' });
  },

  async stakeAPT(ctx: Context) {
    try {
      const stakingData = await aptosService.getStakingInfo();

      const message = `
🏦 *APT Staking*

*Current APY:* ${stakingData.currentAPY}%
*Your Staked:* ${stakingData.stakedAmount} APT
*Pending Rewards:* ${stakingData.pendingRewards} APT
*Next Reward:* ${stakingData.nextReward}

*Validator Information:*
• Name: ${stakingData.validator.name}
• Commission: ${stakingData.validator.commission}%
• Uptime: ${stakingData.validator.uptime}%
• Voting Power: ${stakingData.validator.votingPower}%

*Staking Options:*
• Minimum stake: 11 APT
• Lockup period: 30 days
• Rewards distributed: Every epoch (~2 hours)

To stake APT, use the button below and specify the amount.
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏦 Stake APT', callback_data: 'stake_amount' },
              { text: '🔓 Unstake APT', callback_data: 'unstake_amount' }
            ],
            [
              { text: '💰 Claim Rewards', callback_data: 'claim_rewards' },
              { text: '🔄 Switch Validator', callback_data: 'switch_validator' }
            ],
            [
              { text: '📊 Staking Stats', callback_data: 'staking_stats' },
              { text: '🔙 Back', callback_data: 'wallet_balance' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to fetch staking information. Please try again.');
    }
  },

  async walletSettings(ctx: Context) {
    try {
      const userId = ctx.from?.id;
      const settings = await aptosService.getWalletSettings(userId);

      const message = `
⚙️ *Wallet Settings*

*Security Settings:*
${settings.security.twoFactor ? '✅' : '❌'} Two-factor authentication
${settings.security.biometric ? '✅' : '❌'} Biometric unlock
${settings.security.sessionTimeout ? '✅' : '❌'} Auto-logout (${settings.security.timeoutMinutes}min)

*Notification Settings:*
${settings.notifications.transactions ? '✅' : '❌'} Transaction alerts
${settings.notifications.balance ? '✅' : '❌'} Balance changes
${settings.notifications.staking ? '✅' : '❌'} Staking rewards

*Privacy Settings:*
${settings.privacy.hideBalance ? '✅' : '❌'} Hide balance in screenshots
${settings.privacy.analytics ? '✅' : '❌'} Usage analytics
${settings.privacy.marketing ? '✅' : '❌'} Marketing communications

*Network Settings:*
• Current Network: ${settings.network.current}
• RPC Endpoint: ${settings.network.rpc}
• Gas Price: ${settings.network.gasPrice} (${settings.network.gasPriceLevel})
      `;

      await ctx.replyWithMarkdown(message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔐 Security', callback_data: 'security_settings' },
              { text: '🔔 Notifications', callback_data: 'notification_settings' }
            ],
            [
              { text: '🌐 Network', callback_data: 'network_settings' },
              { text: '🔒 Privacy', callback_data: 'privacy_settings' }
            ],
            [
              { text: '💾 Backup Wallet', callback_data: 'backup_wallet' },
              { text: '🔄 Reset Settings', callback_data: 'reset_settings' }
            ],
            [
              { text: '🔙 Back to Wallet', callback_data: 'wallet_status' }
            ]
          ]
        }
      });
    } catch (error) {
      await ctx.reply('❌ Failed to fetch wallet settings. Please try again.');
    }
  },

  async walletHelp(ctx: Context) {
    const message = `
❓ *Wallet Help*

*Getting Started:*
1. Download a supported Aptos wallet
2. Create a new wallet or import existing
3. Use /connectwallet to link with APTpay
4. Start managing your payroll!

*Supported Wallets:*
🪨 *Petra Wallet* - Most popular
👽 *Martian Wallet* - Feature-rich
🔮 *Fewcha Wallet* - Privacy-focused
🌉 *Pontem Wallet* - DeFi optimized

*Security Tips:*
• Never share your private keys
• Always verify transaction details
• Use hardware wallets for large amounts
• Keep your wallet app updated

*Troubleshooting:*
• Connection issues: Try refreshing QR code
• Balance not updating: Check network status
• Transaction failed: Verify gas fees
• Wallet not detected: Ensure app is open

*Need More Help?*
• Check our FAQ: /help
• Contact support: /support
• Join community: @aptpay_support
    `;

    await ctx.replyWithMarkdown(message, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🪨 Get Petra', url: 'https://petra.app/' },
            { text: '👽 Get Martian', url: 'https://martianwallet.xyz/' }
          ],
          [
            { text: '📚 Documentation', url: 'https://docs.aptpay.app/' },
            { text: '💬 Support Chat', url: 'https://t.me/aptpay_support' }
          ],
          [
            { text: '🔙 Back', callback_data: 'wallet_status' }
          ]
        ]
      }
    });
  }
};