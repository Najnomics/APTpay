# 🚀 APTpay Deployment Guide

This guide will walk you through deploying and running the complete APTpay platform.

## 📋 Prerequisites

- **Aptos CLI** (v2.0+)
- **Node.js** (v18+)
- **npm** or **yarn**
- **Git**

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aptos-aptpay.git
cd aptos-aptpay
```

### 2. Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### 3. Install Dependencies
```bash
# Frontend dependencies
cd frontend
npm install

# Telegram bot dependencies
cd ../telegram-bot
npm install

# Back to root
cd ..
```

## 🚀 Deployment Steps

### 1. Deploy Smart Contracts
```bash
cd contracts
./scripts/deploy-contracts.sh
```

This will:
- Compile all Move contracts
- Run comprehensive tests
- Deploy to Aptos devnet
- Initialize the system
- Generate deployment info

### 2. Set Up Demo Environment
```bash
./scripts/setup-demo.sh
```

This will:
- Create demo employees
- Deposit demo funds
- Calculate initial yield
- Set up demo configuration

### 3. Start the Frontend
```bash
cd frontend
npm start
```

The React dashboard will be available at `http://localhost:3000`

### 4. Start the Telegram Bot
```bash
cd telegram-bot
cp .env.example .env
# Edit .env with your bot token
npm start
```

## 🎪 Running the Demo

### Complete Payroll Demo
```bash
node scripts/run-payroll-demo.js
```

This demonstrates:
- Treasury balance check
- Forex optimization
- Parallel payroll execution
- Cross-border payments
- Performance metrics

### Frontend Demo
1. Open `http://localhost:3000`
2. Navigate through different sections:
   - Dashboard: Overview and statistics
   - Payroll Manager: Employee management
   - Treasury Overview: Fund management
   - Forex Module: Currency exchange
   - Settings: Configuration

### Telegram Bot Demo
1. Start a chat with your bot
2. Use `/start` to see the main menu
3. Try commands like:
   - `/payroll` - Payroll management
   - `/treasury` - Treasury overview
   - `/employees` - Employee list
   - `/help` - Available commands

## 📊 Demo Data

The demo includes:
- **3 Demo Employees** across 3 countries
- **$100,000 USDC** treasury balance
- **$14,700** monthly payroll
- **4.2% APY** yield generation
- **3 Supported currencies** (USDC, EURc, GBPc)

## 🔍 Verification

### Contract Verification
```bash
cd contracts
aptos move view --function-id <DEPLOYED_ADDRESS>::payroll_module_no_time::get_employee_count
```

### Frontend Verification
- Check dashboard loads correctly
- Verify employee data displays
- Test treasury operations
- Confirm forex rates show

### Bot Verification
- Send `/start` to bot
- Verify menu appears
- Test basic commands
- Check error handling

## 🛠️ Configuration

### Frontend Configuration
Update `frontend/src/config.ts`:
```typescript
export const CONFIG = {
  CONTRACT_ADDRESS: 'YOUR_DEPLOYED_ADDRESS',
  NETWORK: 'devnet',
  NODE_URL: 'https://fullnode.devnet.aptoslabs.com'
};
```

### Bot Configuration
Update `telegram-bot/.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
APTOS_MODULE_ADDRESS=your_deployed_address
ADMIN_CHAT_IDS=your_chat_ids
```

## 📈 Performance Metrics

The demo showcases:
- **Parallel Processing**: 1000+ employees supported
- **Speed**: 3-minute execution vs 7-day traditional
- **Cost Efficiency**: 0.5-1% vs 5-15% traditional
- **Yield Generation**: 4.2% APY on treasury
- **Cross-Border**: Multi-currency support
- **Security**: Multi-sig + Move safety

## 🔧 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check Aptos CLI version
   - Verify network connectivity
   - Ensure sufficient account balance

2. **Frontend Won't Start**
   - Check Node.js version
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

3. **Bot Not Responding**
   - Verify bot token is correct
   - Check network connectivity
   - Review bot logs for errors

4. **Tests Failing**
   - Ensure all dependencies installed
   - Check Move.toml configuration
   - Verify Aptos CLI setup

### Getting Help

- Check the [README.md](README.md) for detailed information
- Review [API documentation](docs/api-reference.md)
- Join our [Discord community](https://discord.gg/aptpay)
- Submit issues on [GitHub](https://github.com/your-username/aptos-aptpay/issues)

## 🎯 Next Steps

After successful deployment:

1. **Customize Configuration**: Update settings for your needs
2. **Add Real Employees**: Replace demo data with actual employees
3. **Connect Real Wallet**: Use production wallet instead of demo
4. **Scale Testing**: Test with larger employee counts
5. **Production Deployment**: Deploy to mainnet when ready

## 🚀 Production Deployment

For production deployment:

1. **Security Audit**: Complete security review
2. **Mainnet Deployment**: Deploy to Aptos mainnet
3. **Domain Setup**: Configure custom domain
4. **SSL Certificate**: Set up HTTPS
5. **Monitoring**: Implement production monitoring
6. **Backup**: Set up automated backups

---

**🎉 Congratulations!** You've successfully deployed APTpay. The platform is now ready to revolutionize cross-border payroll with instant, low-cost, yield-optimized payments on Aptos blockchain.

*Built with ❤️ for the global workforce*