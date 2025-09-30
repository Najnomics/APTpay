#[test_only]
module aptpay::simple_tests {
    use std::signer;
    use aptos_framework::timestamp;
    use aptpay::payroll_module;

    #[test(admin = @aptpay)]
    public fun test_simple_initialize(admin: &signer) {
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(admin);
        
        // Initialize payroll module
        payroll_module::initialize(admin);
        
        // Test should pass without errors
        assert!(payroll_module::get_employee_count() == 0, 1);
    }

    #[test(admin = @aptpay)]
    public fun test_simple_treasury_operations(admin: &signer) {
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(admin);
        
        // Initialize payroll module (which includes treasury)
        payroll_module::initialize(admin);
        
        // Test treasury operations
        payroll_module::deposit_treasury(admin, 1000000000); // 1000 USDC
        assert!(payroll_module::get_treasury_balance(signer::address_of(admin)) == 1000000000, 2);
    }
}
