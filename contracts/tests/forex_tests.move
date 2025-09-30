#[test_only]
module aptpay::forex_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptpay::forex_module;
    use aptpay::access_control;

    #[test(admin = @aptpay)]
    public fun test_initialize_forex(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Initialize access control first
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        
        // Initialize forex module
        forex_module::initialize(admin);
        
        // Check initial swap volume
        assert!(forex_module::get_swap_volume() == 0, 1);
    }

    #[test(admin = @aptpay)]
    public fun test_add_currency_pair(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        forex_module::initialize(admin);
        
        // Add new currency pair
        forex_module::add_currency_pair(
            admin,
            b"USDC",
            b"JPYc"
        );
        
        // Test should complete without errors
    }

    #[test(admin = @aptpay)]
    public fun test_set_slippage_tolerance(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        forex_module::initialize(admin);
        
        // Set slippage tolerance
        forex_module::set_slippage_tolerance(admin, 100); // 1.0%
        
        // Test should complete without errors
    }

    #[test(admin = @aptpay)]
    #[expected_failure] // Will fail because no rates are set
    public fun test_get_optimal_rate_no_data(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        forex_module::initialize(admin);
        
        // Try to get rate without any data
        let (_rate, _dex) = forex_module::get_optimal_rate(b"USDC", b"EURc", 1000000);
    }

    #[test(admin = @aptpay)]
    #[expected_failure] // Will fail because no rates are set
    public fun test_get_current_rate_no_data(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        // Setup
        let signers = vector::singleton(admin_addr);
        access_control::initialize(admin, signers, 1);
        forex_module::initialize(admin);
        
        // Try to get current rate without any data
        let _rate = forex_module::get_current_rate(b"USDC", b"EURc");
    }
}