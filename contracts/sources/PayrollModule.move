/// Simplified APTpay module for successful compilation and deployment demo
module aptpay::simple_payroll {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;

    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_AUTHORIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;

    struct PayrollSystem has key {
        admin: address,
        employees: vector<address>,
        total_payments: u64,
        is_paused: bool,
        created_at: u64,
    }

    struct CompanyTreasury has key {
        balance: u64,
        yield_earned: u64,
        apy: u64, // Annual Percentage Yield in basis points
        last_update: u64,
    }

    /// Initialize the APTpay payroll system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<PayrollSystem>(admin_addr), error::already_exists(E_NOT_INITIALIZED));

        move_to(admin, PayrollSystem {
            admin: admin_addr,
            employees: vector::empty(),
            total_payments: 0,
            is_paused: false,
            created_at: timestamp::now_seconds(),
        });

        move_to(admin, CompanyTreasury {
            balance: 0,
            yield_earned: 0,
            apy: 420, // 4.20% APY
            last_update: timestamp::now_seconds(),
        });
    }

    /// Add employee to payroll system
    public entry fun add_employee(admin: &signer, employee: address) acquires PayrollSystem {
        let admin_addr = signer::address_of(admin);
        let payroll = borrow_global_mut<PayrollSystem>(admin_addr);
        assert!(payroll.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!payroll.is_paused, error::unavailable(E_NOT_AUTHORIZED));

        vector::push_back(&mut payroll.employees, employee);
    }

    /// Deposit funds to treasury
    public entry fun deposit_treasury(admin: &signer, amount: u64) acquires CompanyTreasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<CompanyTreasury>(admin_addr);
        
        treasury.balance = treasury.balance + amount;
        treasury.last_update = timestamp::now_seconds();
    }

    /// Execute payroll for all employees
    public entry fun execute_payroll(admin: &signer, salary_per_employee: u64) acquires PayrollSystem, CompanyTreasury {
        let admin_addr = signer::address_of(admin);
        let payroll = borrow_global_mut<PayrollSystem>(admin_addr);
        assert!(payroll.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!payroll.is_paused, error::unavailable(E_NOT_AUTHORIZED));

        let employee_count = vector::length(&payroll.employees);
        let total_needed = employee_count * salary_per_employee;

        let treasury = borrow_global_mut<CompanyTreasury>(admin_addr);
        assert!(treasury.balance >= total_needed, error::resource_exhausted(E_INSUFFICIENT_BALANCE));

        // Deduct from treasury
        treasury.balance = treasury.balance - total_needed;
        
        // Update payroll stats
        payroll.total_payments = payroll.total_payments + total_needed;
    }

    /// Calculate and add yield to treasury
    public entry fun compound_yield(admin: &signer) acquires CompanyTreasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<CompanyTreasury>(admin_addr);
        
        let current_time = timestamp::now_seconds();
        let time_elapsed = current_time - treasury.last_update;
        
        // Calculate yield (simplified: per second basis)
        let yield_amount = (treasury.balance * treasury.apy * time_elapsed) / (10000 * 365 * 24 * 3600);
        
        treasury.yield_earned = treasury.yield_earned + yield_amount;
        treasury.balance = treasury.balance + yield_amount;
        treasury.last_update = current_time;
    }

    /// Emergency pause system
    public entry fun emergency_pause(admin: &signer) acquires PayrollSystem {
        let admin_addr = signer::address_of(admin);
        let payroll = borrow_global_mut<PayrollSystem>(admin_addr);
        assert!(payroll.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        
        payroll.is_paused = true;
    }

    /// Unpause system
    public entry fun unpause(admin: &signer) acquires PayrollSystem {
        let admin_addr = signer::address_of(admin);
        let payroll = borrow_global_mut<PayrollSystem>(admin_addr);
        assert!(payroll.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        
        payroll.is_paused = false;
    }

    /// View functions for frontend integration
    #[view]
    public fun get_employee_count(admin: address): u64 acquires PayrollSystem {
        let payroll = borrow_global<PayrollSystem>(admin);
        vector::length(&payroll.employees)
    }

    #[view]
    public fun get_treasury_balance(admin: address): u64 acquires CompanyTreasury {
        let treasury = borrow_global<CompanyTreasury>(admin);
        treasury.balance
    }

    #[view]
    public fun get_yield_earned(admin: address): u64 acquires CompanyTreasury {
        let treasury = borrow_global<CompanyTreasury>(admin);
        treasury.yield_earned
    }

    #[view]
    public fun get_current_apy(admin: address): u64 acquires CompanyTreasury {
        let treasury = borrow_global<CompanyTreasury>(admin);
        treasury.apy
    }

    #[view]
    public fun is_system_paused(admin: address): bool acquires PayrollSystem {
        let payroll = borrow_global<PayrollSystem>(admin);
        payroll.is_paused
    }

    #[view]
    public fun get_total_payments(admin: address): u64 acquires PayrollSystem {
        let payroll = borrow_global<PayrollSystem>(admin);
        payroll.total_payments
    }
}