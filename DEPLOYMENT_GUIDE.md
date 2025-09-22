# 🚀 APTpay Deployment Guide

Complete guide for deploying and running the APTpay Cross-Border Payroll & Treasury Platform.

## 📋 Prerequisites

### System Requirements
- **Node.js** v18+ 
- **Aptos CLI** v2.0+
- **Git** latest
- **VS Code** (recommended) with Move language extension

### Aptos CLI Installation
```bash
# macOS/Linux
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
aptos --version
```

### Account Setup
```bash
# Initialize a new Aptos account profile
aptos init --profile aptpay-deployer

# Fund the account (devnet/testnet only)
aptos account fund-with-faucet --profile aptpay-deployer
```

## 🏗️ Project Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd APTpay

# Install Node.js dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment Configuration
Create `.env` file in project root:
```env
# Network Configuration
APTOS_NETWORK=devnet
APTOS_PROFILE=aptpay-deployer

# Package Address (will be updated after deployment)
APTPAY_PACKAGE_ADDRESS=0x1

# Frontend Configuration
REACT_APP_NETWORK=devnet
REACT_APP_API_URL=http://localhost:8080

# Optional: Custom Node URLs
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com
```

## 📦 Smart Contract Deployment

### 1. Compile Contracts
```bash
cd contracts
aptos move compile --profile aptpay-deployer
```

### 2. Run Tests
```bash
aptos move test --profile aptpay-deployer
```

### 3. Deploy to Network
```bash
# Make deployment script executable
chmod +x ../scripts/deploy-contracts.sh

# Deploy to devnet
../scripts/deploy-contracts.sh devnet aptpay-deployer

# Or deploy manually
aptos move publish --profile aptpay-deployer
```

### 4. Get Package Address
```bash
# View deployed package address
aptos account list --profile aptpay-deployer --query balance
```

### 5. Update Configuration
Update the package address in:
- `.env` → `APTPAY_PACKAGE_ADDRESS`
- `frontend/src/config.ts`
- Any deployment scripts

## ⚙️ Contract Initialization

### 1. Initialize Core Modules
```bash
# Get your account address
ACCOUNT=$(aptos config show-profiles --profile aptpay-deployer | grep account | awk '{print $2}')

# Initialize Access Control (admin, signers, threshold)
aptos move run \
  --function-id "$ACCOUNT::access_control::initialize" \
  --args address:["$ACCOUNT"] u64:1 \
  --profile aptpay-deployer

# Initialize other modules
aptos move run --function-id "$ACCOUNT::payroll_module::initialize" --profile aptpay-deployer
aptos move run --function-id "$ACCOUNT::treasury_module::initialize" --profile aptpay-deployer
aptos move run --function-id "$ACCOUNT::forex_module::initialize" --profile aptpay-deployer
aptos move run --function-id "$ACCOUNT::compliance_module::initialize" --profile aptpay-deployer
```

### 2. Set Up Roles and Permissions
```bash
# Grant payroll manager role to admin
aptos move run \
  --function-id "$ACCOUNT::access_control::grant_role" \
  --args address:$ACCOUNT u8:1 \
  --profile aptpay-deployer

# Grant treasury manager role to admin
aptos move run \
  --function-id "$ACCOUNT::access_control::grant_role" \
  --args address:$ACCOUNT u8:2 \
  --profile aptpay-deployer
```

## 🖥️ Frontend Deployment

### 1. Update Configuration
Update `frontend/src/config.ts`:
```typescript
export const APTPAY_CONFIG = {
  packageAddress: "0x<your-package-address>",
  network: "devnet", // or "testnet", "mainnet"
  nodeUrl: "https://fullnode.devnet.aptoslabs.com/v1",
  faucetUrl: "https://faucet.devnet.aptoslabs.com"
};
```

### 2. Build and Run Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build
npm run preview
```

### 3. Deploy to Vercel/Netlify
```bash
# For Vercel
npm i -g vercel
vercel --prod

# For Netlify
npm run build
# Upload dist/ folder to Netlify
```

## 🎪 Demo Environment Setup

### 1. Run Demo Setup
```bash
# Set up demo environment with sample data
npm run setup-demo
```

### 2. Demo Payroll Execution
```bash
# Execute a complete payroll demo
npm run demo-payroll
```

### 3. Access Demo Interface
- **Web Dashboard**: http://localhost:3000
- **API Endpoints**: http://localhost:8080/api
- **Telegram Bot**: @APTpayDemoBot (if configured)

## 🔧 Advanced Configuration

### Custom Yield Strategies
```bash
# Add custom yield strategy
aptos move run \
  --function-id "$ACCOUNT::treasury_module::set_yield_strategy" \
  --args u8:2 \
  --profile aptpay-deployer
```

### Currency Pair Setup
```bash
# Add new currency pair
aptos move run \
  --function-id "$ACCOUNT::forex_module::add_currency_pair" \
  --args string:USDC string:JPYc u64:1000000 u64:1000000000000 u64:25 \
  --profile aptpay-deployer
```

### Compliance Configuration
```bash
# Set up KYC requirements
aptos move run \
  --function-id "$ACCOUNT::compliance_module::submit_kyc" \
  --args string:US u8:2 bytes:[] \
  --profile aptpay-deployer
```

## 📊 Monitoring and Analytics

### 1. Event Monitoring
```bash
# Monitor payroll events
aptos account list --profile aptpay-deployer --query events

# Watch for specific events
aptos account show $ACCOUNT --profile aptpay-deployer
```

### 2. Treasury Analytics
```bash
# Get treasury performance
aptos move view \
  --function-id "$ACCOUNT::treasury_module::get_treasury_balance" \
  --profile aptpay-deployer

# Get current APY
aptos move view \
  --function-id "$ACCOUNT::treasury_module::get_current_apy" \
  --profile aptpay-deployer
```

### 3. System Health Checks
```bash
# Check system status
aptos move view \
  --function-id "$ACCOUNT::access_control::is_emergency_locked" \
  --profile aptpay-deployer

# Employee count
aptos move view \
  --function-id "$ACCOUNT::payroll_module::get_employee_count" \
  --profile aptpay-deployer
```

## 🔐 Security Best Practices

### 1. Multi-Signature Setup
```bash
# Configure 2-of-3 multi-sig
aptos move run \
  --function-id "$ACCOUNT::access_control::initialize" \
  --args address:["$ADMIN1","$ADMIN2","$ADMIN3"] u64:2 \
  --profile aptpay-deployer
```

### 2. Emergency Procedures
```bash
# Emergency pause (if needed)
aptos move run \
  --function-id "$ACCOUNT::access_control::emergency_pause" \
  --profile emergency-contact

# Emergency fund recovery
aptos move run \
  --function-id "$ACCOUNT::treasury_module::emergency_withdraw" \
  --args u64:amount string:currency \
  --profile emergency-contact
```

### 3. Access Control Management
```bash
# Rotate admin keys
aptos move run \
  --function-id "$ACCOUNT::access_control::rotate_admin_keys" \
  --profile aptpay-deployer

# Revoke compromised roles
aptos move run \
  --function-id "$ACCOUNT::access_control::revoke_role" \
  --args address:$COMPROMISED_USER u8:$ROLE \
  --profile aptpay-deployer
```

## 🚨 Troubleshooting

### Common Issues

**1. Compilation Errors**
```bash
# Update dependencies
aptos move clean
aptos move compile --profile aptpay-deployer
```

**2. Transaction Failures**
```bash
# Check account balance
aptos account list --profile aptpay-deployer --query balance

# Fund account if needed
aptos account fund-with-faucet --profile aptpay-deployer
```

**3. Module Not Found Errors**
```bash
# Verify deployment
aptos account show $ACCOUNT --profile aptpay-deployer

# Check module address
aptos move view --function-id "$ACCOUNT::payroll_module::get_employee_count"
```

**4. Permission Denied**
```bash
# Check roles
aptos move view \
  --function-id "$ACCOUNT::access_control::has_role" \
  --args address:$USER u8:$ROLE
```

### Network Issues
```bash
# Test network connectivity
curl -X GET "https://fullnode.devnet.aptoslabs.com/v1/"

# Switch networks
export APTOS_NETWORK=testnet
aptos config set-profile --profile aptpay-deployer
```

## 📈 Production Deployment

### 1. Mainnet Preparation
- Complete security audit
- Set up monitoring infrastructure
- Configure production wallets
- Establish emergency procedures

### 2. Mainnet Deployment
```bash
# Deploy to mainnet
./scripts/deploy-contracts.sh mainnet aptpay-mainnet

# Verify deployment
aptos move view --function-id "$MAINNET_ADDRESS::payroll_module::get_employee_count"
```

### 3. Go-Live Checklist
- [ ] All contracts deployed and verified
- [ ] Treasury funded with initial capital
- [ ] Employee data imported
- [ ] Compliance framework configured
- [ ] Multi-sig wallets set up
- [ ] Emergency procedures tested
- [ ] Frontend deployed and accessible
- [ ] Monitoring systems active

## 🔗 Useful Commands

```bash
# Quick development cycle
npm run compile && npm run test && npm run deploy

# Full system test
npm run setup-demo && npm run demo-payroll

# Check system health
aptos account list --profile aptpay-deployer

# View transaction history
aptos account show $ACCOUNT --profile aptpay-deployer
```

## 📞 Support

- **Documentation**: https://docs.aptpay.finance
- **GitHub Issues**: https://github.com/aptpay/aptpay/issues
- **Discord**: https://discord.gg/aptpay
- **Email**: support@aptpay.finance

---

*Built with ❤️ for the global workforce on Aptos blockchain*