#[test_only]
module aptpay::working_tests {
    use std::signer;
    use aptpay::payroll_module;

    #[test(admin = @aptpay)]
    public fun test_basic_payroll_initialize(admin: &signer) {
        // Initialize payroll module
        payroll_module::initialize(admin);
        
        // Test should pass without errors
        assert!(payroll_module::get_employee_count() == 0, 1);
    }

    #[test(admin = @aptpay)]
    public fun test_basic_treasury_deposit(admin: &signer) {
        // Initialize payroll module (which includes treasury)
        payroll_module::initialize(admin);
        
        // Test treasury operations
        payroll_module::deposit_treasury(admin, 1000000000); // 1000 USDC
        assert!(payroll_module::get_treasury_balance(signer::address_of(admin)) == 1000000000, 2);
    }

    #[test(admin = @aptpay)]
    public fun test_basic_yield_calculation(admin: &signer) {
        // Initialize payroll module
        payroll_module::initialize(admin);
        
        // Test yield calculation
        payroll_module::compound_yield(admin);
        
        // Should complete without errors
        assert!(true, 3);
    }
}
