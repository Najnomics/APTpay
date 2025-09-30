#[test_only]
module aptpay::treasury_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptpay::treasury_module;
    use aptpay::access_control;

    #[test(admin = @aptpay)]
    public fun test_initialize_treasury(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Initialize access control first
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        
        // Initialize treasury module
        treasury_module::initialize(admin);
        
        // Check initial balance
        let (available, yield_balance, total_yield) = treasury_module::get_treasury_balance();
        assert!(available == 0, 1);
        assert!(yield_balance == 0, 2);
        assert!(total_yield == 0, 3);
    }

    #[test(admin = @aptpay)]
    public fun test_get_current_apy(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        treasury_module::initialize(admin);
        
        // Get current APY
        let apy = treasury_module::get_current_apy();
        
        // Should have a default APY greater than 0
        assert!(apy > 0, 4);
    }

    #[test(admin = @aptpay)]
    public fun test_emergency_lock_status(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        treasury_module::initialize(admin);
        
        // Check initial emergency lock status
        assert!(!treasury_module::is_emergency_locked(), 5);
    }

    #[test(admin = @aptpay)]
    public fun test_set_yield_strategy(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        treasury_module::initialize(admin);
        
        // Set yield strategy (should not fail)
        treasury_module::set_yield_strategy(admin, 1); // STRATEGY_LENDING
        
        // Test completes without errors
    }

    #[test(admin = @aptpay)]
    public fun test_calculate_treasury_yield(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        treasury_module::initialize(admin);
        
        // Calculate yield (should not fail even with zero balance)
        treasury_module::calculate_treasury_yield(admin);
        
        // Test completes without errors
    }
}