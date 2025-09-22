#!/bin/bash

# APTpay Contract Deployment Script
# This script deploys all APTpay smart contracts to Aptos

set -e

echo "🚀 APTpay Contract Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NETWORK=${1:-devnet}
PROFILE=${2:-default}

echo -e "${BLUE}Network: $NETWORK${NC}"
echo -e "${BLUE}Profile: $PROFILE${NC}"
echo ""

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo -e "${RED}❌ Aptos CLI not found${NC}"
    echo "Please install Aptos CLI: https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli"
    exit 1
fi

echo -e "${GREEN}✅ Aptos CLI found${NC}"

# Navigate to contracts directory
cd contracts

# Step 1: Compile contracts
echo -e "${YELLOW}📋 Step 1: Compiling contracts...${NC}"
if aptos move compile --profile $PROFILE; then
    echo -e "${GREEN}✅ Compilation successful${NC}"
else
    echo -e "${RED}❌ Compilation failed${NC}"
    exit 1
fi

# Step 2: Run tests
echo -e "${YELLOW}🧪 Step 2: Running tests...${NC}"
if aptos move test --profile $PROFILE; then
    echo -e "${GREEN}✅ All tests passed${NC}"
else
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi

# Step 3: Deploy contracts
echo -e "${YELLOW}🚀 Step 3: Deploying contracts...${NC}"
if aptos move publish --profile $PROFILE; then
    echo -e "${GREEN}✅ Deployment successful${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 4: Initialize contracts
echo -e "${YELLOW}⚙️ Step 4: Initializing contracts...${NC}"

# Get the deployed package address
PACKAGE_ADDRESS=$(aptos account list --profile $PROFILE --query balance 2>/dev/null | grep -o "0x[a-fA-F0-9]*" | head -1)

if [ -z "$PACKAGE_ADDRESS" ]; then
    echo -e "${RED}❌ Could not determine package address${NC}"
    exit 1
fi

echo -e "${BLUE}Package Address: $PACKAGE_ADDRESS${NC}"

# Initialize Access Control
echo "Initializing Access Control..."
aptos move run \
    --function-id "$PACKAGE_ADDRESS::access_control::initialize" \
    --args address:["$PACKAGE_ADDRESS"] u64:1 \
    --profile $PROFILE

# Initialize other modules
echo "Initializing Payroll Module..."
aptos move run \
    --function-id "$PACKAGE_ADDRESS::payroll_module::initialize" \
    --profile $PROFILE

echo "Initializing Treasury Module..."
aptos move run \
    --function-id "$PACKAGE_ADDRESS::treasury_module::initialize" \
    --profile $PROFILE

echo "Initializing Forex Module..."
aptos move run \
    --function-id "$PACKAGE_ADDRESS::forex_module::initialize" \
    --profile $PROFILE

echo "Initializing Compliance Module..."
aptos move run \
    --function-id "$PACKAGE_ADDRESS::compliance_module::initialize" \
    --profile $PROFILE

echo -e "${GREEN}✅ All modules initialized${NC}"

# Step 5: Display deployment summary
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=========================="
echo -e "${BLUE}Package Address:${NC} $PACKAGE_ADDRESS"
echo -e "${BLUE}Network:${NC} $NETWORK"
echo -e "${BLUE}Profile:${NC} $PROFILE"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update your frontend configuration with the package address"
echo "2. Set up initial treasury funds"
echo "3. Configure employees and payroll schedules"
echo "4. Test the complete payroll flow"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "• View account: aptos account list --profile $PROFILE"
echo "• Fund account: aptos account fund-with-faucet --profile $PROFILE"
echo "• Run demo: npm run setup-demo"
echo ""

cd ..