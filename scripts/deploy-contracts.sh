#!/bin/bash

# APTpay Contract Deployment Script
# This script deploys all APTpay contracts to Aptos devnet

set -e

echo "🚀 Starting APTpay Contract Deployment..."
echo "========================================"

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI not found. Please install it first:"
    echo "   curl -fsSL \"https://aptos.dev/scripts/install_cli.py\" | python3"
    exit 1
fi

# Check if we're in the contracts directory
if [ ! -f "Move.toml" ]; then
    echo "❌ Move.toml not found. Please run this script from the contracts directory."
    exit 1
fi

# Set up Aptos profile for devnet
echo "📝 Setting up Aptos profile..."
aptos init --profile devnet --network devnet --rest-url https://fullnode.devnet.aptoslabs.com --faucet-url https://faucet.devnet.aptoslabs.com

# Fund the account
echo "💰 Funding account..."
aptos account fund-with-faucet --profile devnet

# Compile contracts
echo "🔨 Compiling contracts..."
aptos move compile

# Run tests
echo "🧪 Running tests..."
aptos move test

# Publish contracts
echo "📦 Publishing contracts..."
aptos move publish --profile devnet

# Get the deployed address
DEPLOYED_ADDRESS=$(aptos account list --query addresses --profile devnet | jq -r '.devnet')
echo "✅ Contracts deployed successfully!"
echo "📍 Deployed Address: $DEPLOYED_ADDRESS"

# Initialize the system
echo "🔧 Initializing APTpay system..."
aptos move run --function-id $DEPLOYED_ADDRESS::payroll_module_no_time::initialize --profile devnet

# Create deployment info file
cat > ../deployment-info.json << EOF
{
  "deployed_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "network": "devnet",
  "address": "$DEPLOYED_ADDRESS",
  "modules": [
    "$DEPLOYED_ADDRESS::payroll_module_no_time",
    "$DEPLOYED_ADDRESS::treasury_module",
    "$DEPLOYED_ADDRESS::forex_module",
    "$DEPLOYED_ADDRESS::access_control"
  ],
  "status": "deployed",
  "aptos_cli_version": "$(aptos --version | head -n1)",
  "node_url": "https://fullnode.devnet.aptoslabs.com",
  "explorer_url": "https://explorer.aptoslabs.com/account/$DEPLOYED_ADDRESS?network=devnet"
}
EOF

echo "📋 Deployment info saved to deployment-info.json"

# Display summary
echo ""
echo "🎉 APTpay Deployment Complete!"
echo "=============================="
echo "📍 Contract Address: $DEPLOYED_ADDRESS"
echo "🌐 Explorer: https://explorer.aptoslabs.com/account/$DEPLOYED_ADDRESS?network=devnet"
echo "🔗 Node URL: https://fullnode.devnet.aptoslabs.com"
echo ""
echo "Next steps:"
echo "1. Update frontend configuration with the deployed address"
echo "2. Start the Telegram bot"
echo "3. Access the web dashboard"
echo ""
echo "🚀 APTpay is now live on Aptos devnet!"