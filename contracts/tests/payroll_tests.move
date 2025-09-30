#[test_only]
module aptpay::payroll_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptpay::payroll_module;
    use aptpay::access_control;

    #[test(admin = @aptpay, employee = @0x123)]
    public fun test_initialize_payroll(admin: &signer, employee: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(admin);
        
        // Initialize access control first
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        
        // Initialize payroll module
        payroll_module::initialize(admin);
        
        // Test should pass without errors
        assert!(payroll_module::get_employee_count() == 0, 1);
    }

    #[test(admin = @aptpay, employee = @0x123)]
    public fun test_add_employee(admin: &signer, employee: &signer) {
        let admin_addr = signer::address_of(admin);
        let employee_addr = signer::address_of(employee);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        payroll_module::initialize(admin);
        
        // Grant payroll manager role to admin
        access_control::grant_role(admin, admin_addr, 1); // ROLE_PAYROLL_MANAGER = 1
        
        // Add employee
        payroll_module::add_employee(
            admin,
            employee_addr,
            5000000000, // $5,000 USDC
            b"USDC",
            0 // Monthly payment
        );
        
        // Verify employee was added
        assert!(payroll_module::get_employee_count() == 1, 2);
    }

    #[test(admin = @aptpay, employee1 = @0x123, employee2 = @0x456)]
    public fun test_create_payroll_batch(admin: &signer, employee1: &signer, employee2: &signer) {
        let admin_addr = signer::address_of(admin);
        let employee1_addr = signer::address_of(employee1);
        let employee2_addr = signer::address_of(employee2);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        payroll_module::initialize(admin);
        access_control::grant_role(admin, admin_addr, 1);
        
        // Add employees
        payroll_module::add_employee(admin, employee1_addr, 3000000000, b"USDC", 0);
        payroll_module::add_employee(admin, employee2_addr, 4000000000, b"USDC", 0);
        
        // Create batch
        let addresses = vector[employee1_addr, employee2_addr];
        let amounts = vector[3000000000, 4000000000];
        
        payroll_module::create_employee_batch(
            admin,
            addresses,
            amounts,
            b"USDC"
        );
        
        // Verify batch was created
        assert!(payroll_module::get_batch_status(1) == 0, 4); // PENDING status
    }

    #[test(admin = @aptpay)]
    #[expected_failure(abort_code = 2)] // E_EMPLOYEE_NOT_FOUND
    public fun test_add_nonexistent_employee_to_batch(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        payroll_module::initialize(admin);
        access_control::grant_role(admin, admin_addr, 1);
        
        // Try to create batch with non-existent employee
        let addresses = vector[@0x999];
        let amounts = vector[1000000000];
        
        payroll_module::create_employee_batch(
            admin,
            addresses,
            amounts,
            b"USDC"
        );
    }

    #[test(admin = @aptpay, employee = @0x123)]
    public fun test_update_employee_currency(admin: &signer, employee: &signer) {
        let admin_addr = signer::address_of(admin);
        let employee_addr = signer::address_of(employee);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        payroll_module::initialize(admin);
        access_control::grant_role(admin, admin_addr, 1);
        
        // Add employee
        payroll_module::add_employee(admin, employee_addr, 5000000000, b"USDC", 0);
        
        // Update currency preference
        payroll_module::update_employee_currency(employee, b"EURc");
        
        // Test should complete without errors
    }
}