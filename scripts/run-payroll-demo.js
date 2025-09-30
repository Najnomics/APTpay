#!/usr/bin/env node

/**
 * APTpay Payroll Demo Script
 * Demonstrates the complete payroll execution flow
 */

const fs = require('fs');
const path = require('path');

// Demo configuration
const DEMO_CONFIG = {
  contractAddress: '0xaa7c8dabab649d2bebfb17d8463c5a395a078ca09919da2c9cf26763997e4ad7',
  network: 'devnet',
  employees: [
    {
      name: 'Alice Johnson',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      salary: 5000,
      currency: 'USDC',
      country: 'United States'
    },
    {
      name: 'Bob Smith',
      address: '0x2345678901bcdef12345678901bcdef1234567890',
      salary: 4500,
      currency: 'USDC',
      country: 'Germany'
    },
    {
      name: 'Carol Davis',
      address: '0x3456789012cdef123456789012cdef1234567890',
      salary: 5200,
      currency: 'USDC',
      country: 'United Kingdom'
    }
  ]
};

class APTpayDemo {
    constructor() {
    this.startTime = Date.now();
    this.results = {
      success: false,
      transactionHash: null,
      totalAmount: 0,
      employeeCount: 0,
      executionTime: 0,
      gasUsed: 0,
      payments: [],
      errors: []
    };
  }

  async runDemo() {
    console.log('🎪 APTpay Payroll Demo');
    console.log('====================');
    console.log('');

    try {
      await this.showDemoOverview();
      await this.simulateTreasuryCheck();
      await this.simulateForexOptimization();
      await this.simulatePayrollExecution();
      await this.showResults();
        } catch (error) {
      console.error('❌ Demo failed:', error.message);
      this.results.errors.push(error.message);
    }

    return this.results;
  }

  async showDemoOverview() {
    console.log('📊 Demo Overview');
    console.log('---------------');
    console.log(`📍 Contract: ${DEMO_CONFIG.contractAddress}`);
    console.log(`🌐 Network: ${DEMO_CONFIG.network}`);
    console.log(`👥 Employees: ${DEMO_CONFIG.employees.length}`);
    console.log(`💰 Total Payroll: ${this.calculateTotalPayroll().toLocaleString()} USDC`);
    console.log(`🌍 Countries: ${new Set(DEMO_CONFIG.employees.map(e => e.country)).size}`);
    console.log('');
  }

  async simulateTreasuryCheck() {
    console.log('💰 Treasury Check');
    console.log('----------------');
    
    const treasuryBalance = 100000; // 100K USDC
    const totalPayroll = this.calculateTotalPayroll();
    const availableBalance = treasuryBalance * 0.95; // 95% available
    
    console.log(`💳 Treasury Balance: ${treasuryBalance.toLocaleString()} USDC`);
    console.log(`💸 Required for Payroll: ${totalPayroll.toLocaleString()} USDC`);
    console.log(`✅ Available Balance: ${availableBalance.toLocaleString()} USDC`);
    
    if (availableBalance >= totalPayroll) {
      console.log('✅ Treasury has sufficient funds for payroll');
    } else {
      throw new Error('Insufficient treasury funds');
    }
    console.log('');
  }

  async simulateForexOptimization() {
    console.log('🌍 Forex Optimization');
    console.log('--------------------');
    
    // Simulate rate queries across DEXs
    const rates = {
      'USDC/EURc': { merkle: 0.920, hyperion: 0.918, tapp: 0.915 },
      'USDC/GBPc': { merkle: 0.787, hyperion: 0.785, tapp: 0.783 },
      'USDC/JPYc': { merkle: 148.2, hyperion: 148.5, tapp: 148.8 }
    };

    console.log('🔍 Querying DEX rates...');
    await this.sleep(1000);
    
    for (const [pair, dexRates] of Object.entries(rates)) {
      const bestDex = Object.keys(dexRates).reduce((a, b) => 
        dexRates[a] > dexRates[b] ? a : b
      );
      const bestRate = dexRates[bestDex];
      console.log(`📈 ${pair}: ${bestRate} (via ${bestDex})`);
    }
    
    console.log('⚡ Parallel rate optimization complete');
    console.log('');
  }

  async simulatePayrollExecution() {
    console.log('💸 Payroll Execution');
    console.log('-------------------');
    
    const totalAmount = this.calculateTotalPayroll();
    const employeeCount = DEMO_CONFIG.employees.length;
    
    console.log(`🚀 Executing payroll for ${employeeCount} employees...`);
    console.log(`💰 Total amount: ${totalAmount.toLocaleString()} USDC`);
    
    // Simulate parallel processing
    console.log('⚡ Processing payments in parallel...');
    await this.sleep(2000);
    
    // Simulate individual payments
    for (const employee of DEMO_CONFIG.employees) {
      console.log(`💳 Paying ${employee.name}: ${employee.salary.toLocaleString()} ${employee.currency}`);
      await this.sleep(500);
      
      this.results.payments.push({
        employee: employee.name,
        amount: employee.salary,
        currency: employee.currency,
        address: employee.address,
        status: 'completed'
      });
    }
    
    // Generate mock transaction hash
    this.results.transactionHash = this.generateTransactionHash();
    this.results.totalAmount = totalAmount;
    this.results.employeeCount = employeeCount;
    this.results.executionTime = Date.now() - this.startTime;
    this.results.gasUsed = 0.003; // Mock gas usage
    this.results.success = true;
    
    console.log('✅ All payments completed successfully');
    console.log('');
  }

  async showResults() {
    console.log('📊 Demo Results');
    console.log('===============');
    
    if (this.results.success) {
      console.log('✅ Payroll execution completed successfully!');
      console.log('');
      console.log('📋 Transaction Details:');
      console.log(`🔗 Transaction Hash: ${this.results.transactionHash}`);
      console.log(`💰 Total Amount: ${this.results.totalAmount.toLocaleString()} USDC`);
      console.log(`👥 Employees Paid: ${this.results.employeeCount}`);
      console.log(`⏱️  Execution Time: ${this.results.executionTime}ms`);
      console.log(`⛽ Gas Used: ${this.results.gasUsed} APT`);
      console.log('');
      
      console.log('💳 Individual Payments:');
      this.results.payments.forEach((payment, index) => {
        console.log(`${index + 1}. ${payment.employee}: ${payment.amount.toLocaleString()} ${payment.currency} ✅`);
      });
      console.log('');
      
      console.log('🎯 Key Benefits Demonstrated:');
      console.log('• ⚡ Parallel processing (1000+ employees supported)');
      console.log('• 🌍 Cross-border payments (3 countries)');
      console.log('• 💰 Cost efficiency (0.5-1% vs 5-15% traditional)');
      console.log('• ⏱️  Speed (3 minutes vs 7 days traditional)');
      console.log('• 🔒 Security (multi-sig + Move safety)');
      console.log('• 📈 Yield generation (4.2% APY on treasury)');
      console.log('');
      
      console.log('🚀 APTpay Demo Complete!');
      console.log('Ready to revolutionize global payroll! 🌍⚡');
    } else {
      console.log('❌ Demo failed');
      console.log('Errors:', this.results.errors);
    }
  }

  calculateTotalPayroll() {
    return DEMO_CONFIG.employees.reduce((sum, emp) => sum + emp.salary, 0);
  }

  generateTransactionHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the demo
async function main() {
  const demo = new APTpayDemo();
  const results = await demo.runDemo();
  
  // Save results to file
  const resultsFile = path.join(__dirname, '../demo-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: ${resultsFile}`);
  
  process.exit(results.success ? 0 : 1);
}

// Handle command line execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = APTpayDemo;