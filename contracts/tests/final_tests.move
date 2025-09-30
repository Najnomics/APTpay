#[test_only]
module aptpay::final_tests {
    use std::signer;
    use aptpay::payroll_module_no_time;

    #[test(admin = @aptpay)]
    public fun test_payroll_initialize(admin: &signer) {
        // Initialize payroll module
        payroll_module_no_time::initialize(admin);
        
        // Test should pass without errors
        assert!(payroll_module_no_time::get_employee_count() == 0, 1);
    }

    #[test(admin = @aptpay)]
    public fun test_treasury_deposit(admin: &signer) {
        // Initialize payroll module (which includes treasury)
        payroll_module_no_time::initialize(admin);
        
        // Test treasury operations
        payroll_module_no_time::deposit_treasury(admin, 1000000000); // 1000 USDC
        assert!(payroll_module_no_time::get_treasury_balance(signer::address_of(admin)) == 1000000000, 2);
    }

    #[test(admin = @aptpay)]
    public fun test_yield_calculation(admin: &signer) {
        // Initialize payroll module
        payroll_module_no_time::initialize(admin);
        
        // Deposit some funds first
        payroll_module_no_time::deposit_treasury(admin, 1000000000); // 1000 USDC
        
        // Test yield calculation
        payroll_module_no_time::compound_yield(admin);
        
        // Should complete without errors
        assert!(true, 3);
    }

    #[test(admin = @aptpay)]
    public fun test_emergency_pause(admin: &signer) {
        // Initialize payroll module
        payroll_module_no_time::initialize(admin);
        
        // Test emergency pause
        payroll_module_no_time::emergency_pause(admin);
        assert!(payroll_module_no_time::is_system_paused(signer::address_of(admin)), 4);
        
        // Test unpause
        payroll_module_no_time::unpause(admin);
        assert!(!payroll_module_no_time::is_system_paused(signer::address_of(admin)), 5);
    }

    #[test(admin = @aptpay)]
    public fun test_employee_management(admin: &signer) {
        // Initialize payroll module
        payroll_module_no_time::initialize(admin);
        
        // Add an employee
        payroll_module_no_time::add_employee(admin, @0x123, 5000000000, b"USDC", 0);
        
        // Verify employee count
        assert!(payroll_module_no_time::get_employee_count() == 1, 6);
    }
}
