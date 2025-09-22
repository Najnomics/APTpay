#!/usr/bin/env node

/**
 * APTpay Payroll Demo Script
 * 
 * This script demonstrates a complete payroll cycle:
 * - Loading employee data
 * - Creating payroll batch
 * - Executing payments with FX optimization
 * - Generating compliance reports
 */

class PayrollDemo {
    constructor() {
        this.employees = [
            { id: 1, address: "0x123", name: "Alice Johnson", salary: 5000, currency: "USDC", location: "US" },
            { id: 2, address: "0x456", name: "Bob Schmidt", salary: 4500, currency: "EURc", location: "DE" },
            { id: 3, address: "0x789", name: "Charlie Brown", salary: 6000, currency: "USDC", location: "CA" },
            { id: 4, address: "0xabc", name: "Diana Patel", salary: 3800, currency: "USDC", location: "IN" },
            { id: 5, address: "0xdef", name: "Eva Chen", salary: 5200, currency: "EURc", location: "NL" },
        ];
        
        this.exchangeRates = {
            "USDC/EURc": 0.85,
            "EURc/USDC": 1.18
        };
    }

    async runPayrollDemo() {
        console.log("🚀 APTpay Payroll Demo");
        console.log("=" .repeat(50));
        
        try {
            // Step 1: Display employee roster
            await this.displayEmployeeRoster();
            
            // Step 2: Calculate payroll requirements
            await this.calculatePayrollRequirements();
            
            // Step 3: Optimize treasury and FX
            await this.optimizeTreasuryAndFX();
            
            // Step 4: Execute payroll batch
            await this.executePayrollBatch();
            
            // Step 5: Generate compliance reports
            await this.generateComplianceReports();
            
            // Step 6: Display results
            await this.displayResults();
            
            console.log("✅ Payroll demo completed successfully!");
            
        } catch (error) {
            console.error("❌ Payroll demo failed:", error.message);
            process.exit(1);
        }
    }

    async displayEmployeeRoster() {
        console.log("\n👥 Employee Roster");
        console.log("-" .repeat(30));
        
        this.employees.forEach(emp => {
            console.log(`  ${emp.name} (${emp.location})`);
            console.log(`    Address: ${emp.address}`);
            console.log(`    Salary: ${emp.salary.toLocaleString()} ${emp.currency}`);
            console.log("");
        });
        
        console.log(`Total Employees: ${this.employees.length}`);
    }

    async calculatePayrollRequirements() {
        console.log("\n💰 Payroll Requirements");
        console.log("-" .repeat(30));
        
        const usdcTotal = this.employees
            .filter(emp => emp.currency === "USDC")
            .reduce((sum, emp) => sum + emp.salary, 0);
            
        const eurcTotal = this.employees
            .filter(emp => emp.currency === "EURc")
            .reduce((sum, emp) => sum + emp.salary, 0);
        
        console.log(`  USDC Required: ${usdcTotal.toLocaleString()} USDC`);
        console.log(`  EURc Required: ${eurcTotal.toLocaleString()} EURc`);
        console.log(`  Total USD Equivalent: ${(usdcTotal + (eurcTotal * this.exchangeRates["EURc/USDC"])).toLocaleString()}`);
        
        this.payrollRequirements = { usdcTotal, eurcTotal };
    }

    async optimizeTreasuryAndFX() {
        console.log("\n📈 Treasury & FX Optimization");
        console.log("-" .repeat(30));
        
        // Simulate treasury withdrawal from yield strategy
        const treasuryBalance = 100000; // $100k in treasury
        const yieldEarned = (treasuryBalance * 0.042) / 12; // Monthly yield at 4.2% APY
        
        console.log(`  Treasury Balance: $${treasuryBalance.toLocaleString()}`);
        console.log(`  Monthly Yield Earned: $${yieldEarned.toFixed(2)}`);
        console.log(`  Withdrawing from yield strategy...`);
        
        // Simulate FX optimization
        const eurcNeeded = this.payrollRequirements.eurcTotal;
        const usdcForFX = eurcNeeded * this.exchangeRates["EURc/USDC"];
        const fxFee = usdcForFX * 0.003; // 0.3% FX fee
        
        console.log(`  FX Conversion: ${usdcForFX.toFixed(2)} USDC → ${eurcNeeded} EURc`);
        console.log(`  FX Fee: $${fxFee.toFixed(2)} (0.3%)`);
        console.log(`  DEX Used: Merkle Trade (best rate)`);
        
        this.fxDetails = { usdcForFX, fxFee };
    }

    async executePayrollBatch() {
        console.log("\n⚡ Executing Payroll Batch");
        console.log("-" .repeat(30));
        
        console.log("  Creating payroll batch...");
        console.log("  Batch ID: 2025-001");
        console.log("  Processing payments in parallel...");
        
        // Simulate parallel payment processing
        for (let i = 0; i < this.employees.length; i++) {
            const emp = this.employees[i];
            await this.simulatePayment(emp, i + 1);
        }
        
        console.log("  ✅ All payments processed successfully");
    }

    async simulatePayment(employee, index) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`    Payment ${index}/5: ${employee.salary} ${employee.currency} → ${employee.address} ✅`);
                resolve();
            }, 200 * index); // Simulate processing time
        });
    }

    async generateComplianceReports() {
        console.log("\n🛡️ Compliance & Reporting");
        console.log("-" .repeat(30));
        
        console.log("  Generating audit trail...");
        console.log("  KYC Status: All employees verified ✅");
        console.log("  AML Screening: No flags detected ✅");
        console.log("  Tax Reporting: Multi-jurisdiction reports generated ✅");
        
        // Simulate compliance checks
        const complianceData = {
            totalTransactions: this.employees.length,
            totalVolume: this.payrollRequirements.usdcTotal + (this.payrollRequirements.eurcTotal * this.exchangeRates["EURc/USDC"]),
            jurisdictions: [...new Set(this.employees.map(emp => emp.location))],
            amlFlags: 0,
            kycCompliance: "100%"
        };
        
        console.log(`  Transactions: ${complianceData.totalTransactions}`);
        console.log(`  Volume: $${complianceData.totalVolume.toLocaleString()}`);
        console.log(`  Jurisdictions: ${complianceData.jurisdictions.join(", ")}`);
        console.log(`  AML Flags: ${complianceData.amlFlags}`);
        console.log(`  KYC Compliance: ${complianceData.kycCompliance}`);
    }

    async displayResults() {
        console.log("\n📊 Payroll Execution Results");
        console.log("=" .repeat(50));
        
        const totalUsdEquivalent = this.payrollRequirements.usdcTotal + 
            (this.payrollRequirements.eurcTotal * this.exchangeRates["EURc/USDC"]);
        
        const traditionalCost = totalUsdEquivalent * 0.15; // 15% traditional fees
        const aptpayCost = this.fxDetails.fxFee + (totalUsdEquivalent * 0.002); // 0.3% FX + 0.2% platform
        const savings = traditionalCost - aptpayCost;
        
        console.log("\n💸 Cost Comparison:");
        console.log(`  Traditional Payroll: $${traditionalCost.toFixed(2)} (15% fees)`);
        console.log(`  APTpay Platform: $${aptpayCost.toFixed(2)} (0.5% total fees)`);
        console.log(`  Cost Savings: $${savings.toFixed(2)} (${((savings/traditionalCost)*100).toFixed(1)}%)`);
        
        console.log("\n⚡ Performance:");
        console.log(`  Processing Time: 3 minutes (vs 3-7 days traditional)`);
        console.log(`  Success Rate: 100% (5/5 payments)`);
        console.log(`  Parallel Processing: ✅ Enabled`);
        
        console.log("\n🏦 Treasury Impact:");
        console.log(`  Yield Earned: $${((100000 * 0.042) / 12).toFixed(2)} this month`);
        console.log(`  Capital Efficiency: 98% (2% emergency reserve)`);
        console.log(`  Next Yield Compound: In 24 hours`);
        
        console.log("\n🌍 Global Reach:");
        console.log(`  Countries Served: ${[...new Set(this.employees.map(emp => emp.location))].length}`);
        console.log(`  Currencies: 2 (USDC, EURc)`);
        console.log(`  Compliance: Multi-jurisdiction ✅`);
        
        console.log("\n🎯 Next Steps:");
        console.log("  • Schedule next payroll cycle");
        console.log("  • Review treasury yield performance");
        console.log("  • Update employee preferences");
        console.log("  • Generate monthly compliance reports");
    }
}

// Run demo if called directly
if (require.main === module) {
    const demo = new PayrollDemo();
    demo.runPayrollDemo().catch(console.error);
}

module.exports = PayrollDemo;