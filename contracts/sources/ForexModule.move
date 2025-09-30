/// Forex Module for APTpay
/// On-chain currency exchange with optimal routing across DEXs
module aptpay::forex_module {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string::{Self, String};
    use aptos_framework::timestamp;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_AUTHORIZED: u64 = 2;
    const E_INVALID_CURRENCY: u64 = 3;
    const E_INVALID_SLIPPAGE: u64 = 4;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 5;

    // DEX identifiers
    const DEX_MERKLE_TRADE: u64 = 1;
    const DEX_HYPERION: u64 = 2;
    const DEX_TAPP: u64 = 3;

    /// Forex system configuration
    struct ForexSystem has key {
        admin: address,
        currency_pairs: vector<CurrencyPair>,
        slippage_tolerance: u64, // in basis points
        total_swap_volume: u64,
        last_rate_update: u64,
        created_at: u64,
    }

    /// Currency pair configuration
    struct CurrencyPair has store {
        base_currency: String,
        quote_currency: String,
        is_active: bool,
        min_trade_size: u64,
        max_trade_size: u64,
        created_at: u64,
    }

    /// Exchange rate data
    struct ExchangeRate has store {
        base_currency: String,
        quote_currency: String,
        rate: u64, // 1e8 precision
        dex_id: u64,
        timestamp: u64,
        liquidity: u64,
    }

    /// Initialize forex system
    public entry fun initialize(admin: &signer) acquires ForexSystem {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, ForexSystem {
            admin: admin_addr,
            currency_pairs: vector::empty(),
            slippage_tolerance: 50, // 0.5% default
            total_swap_volume: 0,
            last_rate_update: timestamp::now_seconds(),
            created_at: timestamp::now_seconds(),
        });

        // Add default currency pairs
        add_currency_pair_internal(admin_addr, b"USDC", b"EURc");
        add_currency_pair_internal(admin_addr, b"USDC", b"GBPc");
        add_currency_pair_internal(admin_addr, b"USDC", b"JPYc");
    }

    /// Add currency pair
    public entry fun add_currency_pair(
        admin: &signer,
        base_currency: vector<u8>,
        quote_currency: vector<u8>
    ) acquires ForexSystem {
        let admin_addr = signer::address_of(admin);
        let forex_system = borrow_global_mut<ForexSystem>(admin_addr);
        
        assert!(forex_system.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        
        add_currency_pair_internal(admin_addr, base_currency, quote_currency);
    }

    /// Internal function to add currency pair
    fun add_currency_pair_internal(
        admin_addr: address,
        base_currency: vector<u8>,
        quote_currency: vector<u8>
    ) acquires ForexSystem {
        let forex_system = borrow_global_mut<ForexSystem>(admin_addr);
        
        vector::push_back(&mut forex_system.currency_pairs, CurrencyPair {
            base_currency: string::utf8(base_currency),
            quote_currency: string::utf8(quote_currency),
            is_active: true,
            min_trade_size: 1000000, // $1 minimum
            max_trade_size: 100000000000, // $100K maximum
            created_at: timestamp::now_seconds(),
        });
    }

    /// Set slippage tolerance
    public entry fun set_slippage_tolerance(
        admin: &signer,
        tolerance: u64
    ) acquires ForexSystem {
        let admin_addr = signer::address_of(admin);
        let forex_system = borrow_global_mut<ForexSystem>(admin_addr);
        
        assert!(forex_system.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(tolerance <= 1000, error::invalid_argument(E_INVALID_SLIPPAGE)); // Max 10%
        
        forex_system.slippage_tolerance = tolerance;
    }

    /// Get optimal exchange rate
    #[view]
    public fun get_optimal_rate(
        base_currency: vector<u8>,
        quote_currency: vector<u8>,
        amount: u64
    ): (u64, u64) acquires ForexSystem {
        let admin_addr = get_admin_address();
        let forex_system = borrow_global<ForexSystem>(admin_addr);
        
        // Mock rate calculation - in real implementation, this would query DEX APIs
        let base_str = string::utf8(base_currency);
        let quote_str = string::utf8(quote_currency);
        
        // Simulate different rates from different DEXs
        let merkle_rate = if (base_str == string::utf8(b"USDC") && quote_str == string::utf8(b"EURc")) {
            92000000 // 0.92 EUR per USD
        } else {
            100000000 // 1:1 default
        };
        
        let hyperion_rate = if (base_str == string::utf8(b"USDC") && quote_str == string::utf8(b"EURc")) {
            91800000 // 0.918 EUR per USD (better rate)
        } else {
            100000000 // 1:1 default
        };
        
        let tapp_rate = if (base_str == string::utf8(b"USDC") && quote_str == string::utf8(b"EURc")) {
            91500000 // 0.915 EUR per USD (best rate)
        } else {
            100000000 // 1:1 default
        };
        
        // Return best rate and DEX ID
        if (tapp_rate >= hyperion_rate && tapp_rate >= merkle_rate) {
            (tapp_rate, DEX_TAPP)
        } else if (hyperion_rate >= merkle_rate) {
            (hyperion_rate, DEX_HYPERION)
        } else {
            (merkle_rate, DEX_MERKLE_TRADE)
        }
    }

    /// Get current exchange rate
    #[view]
    public fun get_current_rate(
        base_currency: vector<u8>,
        quote_currency: vector<u8>
    ): u64 acquires ForexSystem {
        let (rate, _dex) = get_optimal_rate(base_currency, quote_currency, 1000000);
        rate
    }

    /// Execute batch swap
    public entry fun execute_batch_swap(
        admin: &signer,
        base_currency: vector<u8>,
        quote_currency: vector<u8>,
        amounts: vector<u64>
    ) acquires ForexSystem {
        let admin_addr = signer::address_of(admin);
        let forex_system = borrow_global_mut<ForexSystem>(admin_addr);
        
        assert!(forex_system.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        
        let total_amount = calculate_total_amount(&amounts);
        
        // Update total swap volume
        forex_system.total_swap_volume = forex_system.total_swap_volume + total_amount;
        forex_system.last_rate_update = timestamp::now_seconds();
    }

    /// Calculate total amount from vector
    fun calculate_total_amount(amounts: &vector<u64>): u64 {
        let total = 0;
        let len = vector::length(amounts);
        let i = 0;
        
        while (i < len) {
            total = total + *vector::borrow(amounts, i);
            i = i + 1;
        };
        
        total
    }

    /// Get total swap volume
    #[view]
    public fun get_swap_volume(): u64 acquires ForexSystem {
        let admin_addr = get_admin_address();
        let forex_system = borrow_global<ForexSystem>(admin_addr);
        forex_system.total_swap_volume
    }

    /// Get slippage tolerance
    #[view]
    public fun get_slippage_tolerance(): u64 acquires ForexSystem {
        let admin_addr = get_admin_address();
        let forex_system = borrow_global<ForexSystem>(admin_addr);
        forex_system.slippage_tolerance
    }

    /// Get currency pairs count
    #[view]
    public fun get_currency_pairs_count(): u64 acquires ForexSystem {
        let admin_addr = get_admin_address();
        let forex_system = borrow_global<ForexSystem>(admin_addr);
        vector::length(&forex_system.currency_pairs)
    }

    /// Get admin address
    fun get_admin_address(): address {
        @aptpay
    }
}
