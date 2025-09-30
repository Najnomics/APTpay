/// Access Control Module for APTpay
/// Provides multi-signature security and role-based permissions
module aptpay::access_control {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_NOT_AUTHORIZED: u64 = 2;
    const E_INVALID_THRESHOLD: u64 = 3;
    const E_ROLE_NOT_FOUND: u64 = 4;

    // Role constants
    const ROLE_ADMIN: u64 = 0;
    const ROLE_PAYROLL_MANAGER: u64 = 1;
    const ROLE_TREASURY_MANAGER: u64 = 2;
    const ROLE_OPERATOR: u64 = 3;
    const ROLE_AUDITOR: u64 = 4;

    /// Multi-signature configuration
    struct MultiSigConfig has key {
        signers: vector<address>,
        threshold: u64,
        created_at: u64,
    }

    /// Role-based access control
    struct AccessControl has key {
        admin: address,
        roles: vector<Role>,
        emergency_paused: bool,
        last_role_update: u64,
    }

    struct Role has store, drop {
        user: address,
        role_id: u64,
        granted_at: u64,
        granted_by: address,
    }

    /// Initialize access control system
    public entry fun initialize(
        admin: &signer,
        signers: vector<address>,
        threshold: u64
    ) acquires AccessControl {
        let admin_addr = signer::address_of(admin);
        
        // Validate threshold
        assert!(threshold > 0 && threshold <= vector::length(&signers), error::invalid_argument(E_INVALID_THRESHOLD));
        
        // Initialize multi-sig config
        move_to(admin, MultiSigConfig {
            signers: signers,
            threshold: threshold,
            created_at: timestamp::now_seconds(),
        });

        // Initialize access control
        move_to(admin, AccessControl {
            admin: admin_addr,
            roles: vector::empty(),
            emergency_paused: false,
            last_role_update: timestamp::now_seconds(),
        });

        // Grant admin role to initial admin
        grant_role_internal(admin_addr, admin_addr, ROLE_ADMIN);
    }

    /// Grant role to user
    public entry fun grant_role(
        admin: &signer,
        user: address,
        role_id: u64
    ) acquires AccessControl {
        let admin_addr = signer::address_of(admin);
        let access_control = borrow_global_mut<AccessControl>(admin_addr);
        
        assert!(access_control.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!access_control.emergency_paused, error::unavailable(E_NOT_AUTHORIZED));
        
        grant_role_internal(admin_addr, user, role_id);
    }

    /// Internal function to grant role
    fun grant_role_internal(
        admin: address,
        user: address,
        role_id: u64
    ) acquires AccessControl {
        let access_control = borrow_global_mut<AccessControl>(admin);
        
        // Check if role already exists
        let roles = &mut access_control.roles;
        let len = vector::length(roles);
        let i = 0;
        
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role.user == user && role.role_id == role_id) {
                // Role already exists, update timestamp
                let role_mut = vector::borrow_mut(roles, i);
                role_mut.granted_at = timestamp::now_seconds();
                role_mut.granted_by = admin;
                return
            };
            i = i + 1;
        };
        
        // Add new role
        vector::push_back(roles, Role {
            user: user,
            role_id: role_id,
            granted_at: timestamp::now_seconds(),
            granted_by: admin,
        });
        
        access_control.last_role_update = timestamp::now_seconds();
    }

    /// Revoke role from user
    public entry fun revoke_role(
        admin: &signer,
        user: address,
        role_id: u64
    ) acquires AccessControl {
        let admin_addr = signer::address_of(admin);
        let access_control = borrow_global_mut<AccessControl>(admin_addr);
        
        assert!(access_control.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(!access_control.emergency_paused, error::unavailable(E_NOT_AUTHORIZED));
        
        let roles = &mut access_control.roles;
        let len = vector::length(roles);
        let i = 0;
        
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role.user == user && role.role_id == role_id) {
                vector::remove(roles, i);
                access_control.last_role_update = timestamp::now_seconds();
                return
            };
            i = i + 1;
        };
        
        abort error::not_found(E_ROLE_NOT_FOUND)
    }

    /// Emergency pause system
    public entry fun emergency_pause(admin: &signer) acquires AccessControl {
        let admin_addr = signer::address_of(admin);
        let access_control = borrow_global_mut<AccessControl>(admin_addr);
        
        assert!(access_control.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        access_control.emergency_paused = true;
    }

    /// Unpause system
    public entry fun unpause(admin: &signer) acquires AccessControl {
        let admin_addr = signer::address_of(admin);
        let access_control = borrow_global_mut<AccessControl>(admin_addr);
        
        assert!(access_control.admin == admin_addr, error::permission_denied(E_NOT_AUTHORIZED));
        access_control.emergency_paused = false;
    }

    /// Check if user has specific role
    #[view]
    public fun has_role(user: address, role_id: u64): bool acquires AccessControl {
        let admin_addr = get_admin_address();
        let access_control = borrow_global<AccessControl>(admin_addr);
        
        let roles = &access_control.roles;
        let len = vector::length(roles);
        let i = 0;
        
        while (i < len) {
            let role = vector::borrow(roles, i);
            if (role.user == user && role.role_id == role_id) {
                return true
            };
            i = i + 1;
        };
        
        false
    }

    /// Check if system is emergency paused
    #[view]
    public fun is_emergency_paused(): bool acquires AccessControl {
        let admin_addr = get_admin_address();
        let access_control = borrow_global<AccessControl>(admin_addr);
        access_control.emergency_paused
    }

    /// Get admin address
    fun get_admin_address(): address acquires AccessControl {
        // Find any admin address from the access control
        let access_control = borrow_global<AccessControl>(@aptpay);
        access_control.admin
    }

    /// Get multi-sig threshold
    #[view]
    public fun get_multisig_threshold(): u64 acquires MultiSigConfig, AccessControl {
        let admin_addr = get_admin_address();
        let config = borrow_global<MultiSigConfig>(admin_addr);
        config.threshold
    }

    /// Get signers count
    #[view]
    public fun get_signers_count(): u64 acquires MultiSigConfig, AccessControl {
        let admin_addr = get_admin_address();
        let config = borrow_global<MultiSigConfig>(admin_addr);
        vector::length(&config.signers)
    }
}
