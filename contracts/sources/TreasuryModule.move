/// Treasury Module for APTpay
/// Manages corporate fund deposits with automated yield optimization
module aptpay::treasury_module {
    use std::error;
    use std::signer;
    use aptos_framework::timestamp;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_AUTHORIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_INVALID_STRATEGY: u64 = 4;
    const E_EMERGENCY_LOCKED: u64 = 5;

    // Yield strategy constants
    const STRATEGY_NONE: u64 = 0;
    const STRATEGY_LENDING: u64 = 1;
    const STRATEGY_STAKING: u64 = 2;
    const STRATEGY_VAULT: u64 = 3;

    /// Treasury configuration
    struct Treasury has key {
        admin: address,
        available_balance: u64,
        yield_balance: u64,
        total_yield_earned: u64,
        current_apy: u64, // in basis points (420 = 4.20%)
        current_strategy: u64,
        last_yield_update: u64,
        emergency_locked: bool,
        created_at: u64,
    }

    /// Yield strategy configuration
    struct YieldStrategy has key {
        admin: address,
        strategy_id: u64,
        apy: u64,
        risk_level: u64, // 1-10 scale
        min_deposit: u64,
        max_deposit: u64,
        is_active: bool,
        created_at: u64,
    }

    /// Initialize treasury system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, Treasury {
            admin: admin_addr,
            available_balance: 0,
            yield_balance: 0,
            total_yield_earned: 0,
            current_apy: 420, // 4.20% default APY
            current_strategy: STRATEGY_NONE,
            last_yield_update: timestamp::now_seconds(),
            emergency_locked: false,
            created_at: timestamp::now_seconds(),
        });

        // Initialize default yield strategy
        move_to(admin, YieldStrategy {
            admin: admin_addr,
            strategy_id: STRATEGY_LENDING,
            apy: 420, // 4.20%
            risk_level: 3, // Low risk
            min_deposit: 1000000, // $1 USDC
            max_deposit: 100000000000, // $100K USDC
            is_active: true,
            created_at: timestamp::now_seconds(),
        });
    }

    /// Deposit funds to treasury
    public entry fun deposit_treasury_funds(
        admin: &signer,
        amount: u64
    ) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        assert!(treasury.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!treasury.emergency_locked, error::unavailable(E_EMERGENCY_LOCKED));
        
        treasury.available_balance = treasury.available_balance + amount;
        treasury.last_yield_update = timestamp::now_seconds();
    }

    /// Withdraw funds from treasury
    public entry fun withdraw_treasury_funds(
        admin: &signer,
        amount: u64
    ) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        assert!(treasury.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!treasury.emergency_locked, error::unavailable(E_EMERGENCY_LOCKED));
        assert!(treasury.available_balance >= amount, error::resource_exhausted(E_INSUFFICIENT_BALANCE));
        
        treasury.available_balance = treasury.available_balance - amount;
        treasury.last_yield_update = timestamp::now_seconds();
    }

    /// Set yield strategy
    public entry fun set_yield_strategy(
        admin: &signer,
        strategy_id: u64
    ) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        assert!(treasury.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!treasury.emergency_locked, error::unavailable(E_EMERGENCY_LOCKED));
        
        // Validate strategy
        assert!(strategy_id <= STRATEGY_VAULT, error::invalid_argument(E_INVALID_STRATEGY));
        
        // Calculate yield before strategy change
        let current_time = timestamp::now_seconds();
        let time_elapsed = current_time - treasury.last_yield_update;
        
        if (treasury.current_strategy != STRATEGY_NONE && time_elapsed > 0) {
            let yield_amount = (treasury.yield_balance * treasury.current_apy * time_elapsed) / (10000 * 365 * 24 * 3600);
            treasury.total_yield_earned = treasury.total_yield_earned + yield_amount;
            treasury.yield_balance = treasury.yield_balance + yield_amount;
        };
        
        treasury.current_strategy = strategy_id;
        treasury.last_yield_update = timestamp::now_seconds();
    }

    /// Calculate treasury yield
    public entry fun calculate_treasury_yield(admin: &signer) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        calculate_treasury_yield_internal(admin_addr);
    }

    /// Internal yield calculation
    fun calculate_treasury_yield_internal(admin_addr: address) acquires Treasury {
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        if (treasury.current_strategy == STRATEGY_NONE) {
            return
        };
        
        let current_time = timestamp::now_seconds();
        let time_elapsed = current_time - treasury.last_yield_update;
        
        if (time_elapsed == 0) {
            return
        };
        
        // Calculate yield based on current strategy and APY
        let yield_amount = (treasury.yield_balance * treasury.current_apy * time_elapsed) / (10000 * 365 * 24 * 3600);
        
        treasury.total_yield_earned = treasury.total_yield_earned + yield_amount;
        treasury.yield_balance = treasury.yield_balance + yield_amount;
        treasury.last_yield_update = current_time;
    }

    /// Emergency lock treasury
    public entry fun emergency_lock(admin: &signer) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        assert!(treasury.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        treasury.emergency_locked = true;
    }

    /// Unlock treasury
    public entry fun unlock_treasury(admin: &signer) acquires Treasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<Treasury>(admin_addr);
        
        assert!(treasury.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        treasury.emergency_locked = false;
    }

    /// Get treasury balance information
    #[view]
    public fun get_treasury_balance(): (u64, u64, u64) acquires Treasury {
        let admin_addr = get_admin_address();
        let treasury = borrow_global<Treasury>(admin_addr);
        
        (treasury.available_balance, treasury.yield_balance, treasury.total_yield_earned)
    }

    /// Get current APY
    #[view]
    public fun get_current_apy(): u64 acquires Treasury {
        let admin_addr = get_admin_address();
        let treasury = borrow_global<Treasury>(admin_addr);
        treasury.current_apy
    }

    /// Check if emergency locked
    #[view]
    public fun is_emergency_locked(): bool acquires Treasury {
        let admin_addr = get_admin_address();
        let treasury = borrow_global<Treasury>(admin_addr);
        treasury.emergency_locked
    }

    /// Get current strategy
    #[view]
    public fun get_current_strategy(): u64 acquires Treasury {
        let admin_addr = get_admin_address();
        let treasury = borrow_global<Treasury>(admin_addr);
        treasury.current_strategy
    }

    /// Get admin address
    fun get_admin_address(): address {
        @aptpay
    }
}
