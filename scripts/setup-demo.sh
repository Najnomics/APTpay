#!/bin/bash

# APTpay Demo Setup Script
# This script sets up a complete demo environment for APTpay

set -e

echo "🎪 Setting up APTpay Demo Environment..."
echo "======================================="

# Check if deployment info exists
if [ ! -f "../deployment-info.json" ]; then
    echo "❌ Deployment info not found. Please deploy contracts first."
    exit 1
fi

# Read deployment info
DEPLOYED_ADDRESS=$(jq -r '.address' ../deployment-info.json)
echo "📍 Using deployed address: $DEPLOYED_ADDRESS"

# Set up demo data
echo "📊 Setting up demo data..."

# Create demo employees
echo "👥 Creating demo employees..."
aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::add_employee \
  --args address:0x1234567890abcdef1234567890abcdef12345678,u64:5000000000,vector:u8:0x55534443,u64:0 \
  --profile devnet

aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::add_employee \
  --args address:0x2345678901bcdef12345678901bcdef1234567890,u64:4500000000,vector:u8:0x55534443,u64:0 \
  --profile devnet

aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::add_employee \
  --args address:0x3456789012cdef123456789012cdef1234567890,u64:5200000000,vector:u8:0x55534443,u64:0 \
  --profile devnet

# Deposit demo funds
echo "💰 Depositing demo funds..."
aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::deposit_treasury \
  --args u64:100000000000 \
  --profile devnet

# Calculate initial yield
echo "📈 Calculating initial yield..."
aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::compound_yield \
  --profile devnet

# Create demo configuration
cat > ../demo-config.json << EOF
{
  "demo_setup_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contract_address": "$DEPLOYED_ADDRESS",
  "network": "devnet",
  "demo_employees": [
    {
      "name": "Alice Johnson",
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "salary": 5000,
      "currency": "USDC",
      "country": "United States"
    },
    {
      "name": "Bob Smith",
      "address": "0x2345678901bcdef12345678901bcdef1234567890",
      "salary": 4500,
      "currency": "USDC",
      "country": "Germany"
    },
    {
      "name": "Carol Davis",
      "address": "0x3456789012cdef123456789012cdef1234567890",
      "salary": 5200,
      "currency": "USDC",
      "country": "United Kingdom"
    }
  ],
  "treasury_balance": 100000000000,
  "total_employees": 3,
  "monthly_payroll": 14700000000,
  "countries": 3,
  "demo_features": [
    "Employee management",
    "Treasury deposits",
    "Yield calculation",
    "Payroll execution",
    "Cross-border payments"
  ],
  "status": "ready"
}
EOF

echo "✅ Demo setup complete!"
echo ""
echo "🎪 APTpay Demo Environment Ready!"
echo "================================="
echo "📍 Contract Address: $DEPLOYED_ADDRESS"
echo "👥 Demo Employees: 3"
echo "💰 Treasury Balance: 100,000 USDC"
echo "🌍 Countries: 3"
echo "💸 Monthly Payroll: 14,700 USDC"
echo ""
echo "Demo Features:"
echo "• Employee management"
echo "• Treasury deposits"
echo "• Yield calculation"
echo "• Payroll execution"
echo "• Cross-border payments"
echo ""
echo "Next steps:"
echo "1. Start the frontend: cd frontend && npm start"
echo "2. Start the Telegram bot: cd telegram-bot && npm start"
echo "3. Run demo payroll: ./run-payroll-demo.sh"
echo ""
echo "🚀 Ready to demonstrate APTpay!"
