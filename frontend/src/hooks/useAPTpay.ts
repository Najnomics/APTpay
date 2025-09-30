import { useState, useEffect, useCallback } from 'react';
import { AptosAccount } from 'aptos';
import APTpayClient, { APTpayConfig } from '../services/aptosClient';
import { 
  Employee, 
  PayrollBatch, 
  TreasuryData, 
  DashboardData,
  TransactionResult,
  WalletConnection,
  APTpayError
} from '../types';

interface UseAPTpayConfig {
  network?: "mainnet" | "testnet" | "devnet" | "local";
  packageAddress?: string;
  autoConnect?: boolean;
}

interface UseAPTpayReturn {
  // Client and connection
  client: APTpayClient | null;
  wallet: WalletConnection | null;
  isConnected: boolean;
  isLoading: boolean;
  error: APTpayError | null;

  // Connection methods
  connect: (account?: AptosAccount) => Promise<boolean>;
  disconnect: () => void;
  
  // Dashboard data
  dashboardData: DashboardData | null;
  refreshDashboard: () => Promise<void>;

  // Employee management
  addEmployee: (employeeData: {
    address: string;
    salaryAmount: number;
    preferredCurrency: string;
    paymentSchedule: number;
  }) => Promise<TransactionResult>;
  
  getEmployees: () => Promise<Employee[]>;
  
  // Payroll operations
  createPayrollBatch: (
    employeeAddresses: string[],
    amounts: number[],
    currency: string
  ) => Promise<TransactionResult>;
  
  executePayroll: (batchId: number) => Promise<TransactionResult>;
  getBatches: () => Promise<PayrollBatch[]>;
  getBatchStatus: (batchId: number) => Promise<number>;

  // Treasury management
  depositToTreasury: (
    amount: number,
    currency: string,
    strategyType: number
  ) => Promise<TransactionResult>;
  
  withdrawFromTreasury: (
    amount: number,
    currency: string
  ) => Promise<TransactionResult>;
  
  getTreasuryData: () => Promise<TreasuryData>;
  getCurrentAPY: () => Promise<number>;

  // Compliance
  submitKYC: (
    jurisdiction: string,
    verificationLevel: number,
    documentsHash: Uint8Array
  ) => Promise<TransactionResult>;
  
  getKYCStatus: (address: string) => Promise<number>;

  // Utilities
  fundAccount: (amount?: number) => Promise<boolean>;
  getBalance: (address?: string) => Promise<number>;
}

export const useAPTpay = (config: UseAPTpayConfig = {}): UseAPTpayReturn => {
  const [client, setClient] = useState<APTpayClient | null>(null);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APTpayError | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentAccount, setCurrentAccount] = useState<AptosAccount | null>(null);

  // Initialize client
  useEffect(() => {
    const initializeClient = () => {
      try {
        const clientConfig: APTpayConfig = config.packageAddress && config.network 
          ? {
              ...APTpayClient.getDefaultConfig(config.network),
              packageAddress: config.packageAddress
            }
          : APTpayClient.getDefaultConfig(config.network || "devnet");

        const aptpayClient = new APTpayClient(clientConfig);
        setClient(aptpayClient);
        setError(null);
      } catch (err) {
        setError({
          code: "CLIENT_INIT_ERROR",
          message: "Failed to initialize APTpay client",
          details: err,
          timestamp: Date.now()
        });
      }
    };

    initializeClient();
  }, [config.network, config.packageAddress]);

  // Auto-connect if configured
  useEffect(() => {
    if (config.autoConnect && client && !isConnected) {
      connect();
    }
  }, [client, config.autoConnect, isConnected]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any, code: string, message: string) => {
    setError({
      code,
      message,
      details: err,
      timestamp: Date.now()
    });
    console.error(`APTpay Error [${code}]:`, message, err);
  }, []);

  const connect = useCallback(async (account?: AptosAccount): Promise<boolean> => {
    if (!client) {
      handleError(null, "NO_CLIENT", "Client not initialized");
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      // Create new account if none provided
      const aptosAccount = account || new AptosAccount();
      setCurrentAccount(aptosAccount);

      // Get account balance
      const balance = await client.getAccountBalance(aptosAccount.address().hex());

      // Set wallet connection
      const walletConnection: WalletConnection = {
        address: aptosAccount.address().hex(),
        publicKey: aptosAccount.pubKey().hex(),
        isConnected: true,
        network: client['config'].network,
        balance
      };

      setWallet(walletConnection);
      setIsConnected(true);
      
      return true;
    } catch (err) {
      handleError(err, "CONNECTION_ERROR", "Failed to connect wallet");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [client, handleError, clearError]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setIsConnected(false);
    setCurrentAccount(null);
    setDashboardData(null);
    clearError();
  }, [clearError]);

  const refreshDashboard = useCallback(async (): Promise<void> => {
    if (!client || !isConnected) return;

    setIsLoading(true);
    try {
      const [
        employeeCount,
        treasuryBalance,
        currentAPY
      ] = await Promise.all([
        client.getEmployeeCount(),
        client.getTreasuryBalance(),
        client.getCurrentAPY()
      ]);

      const dashboardData: DashboardData = {
        employeeCount,
        treasuryBalance: {
          total_deposits: 0,
          available_balance: treasuryBalance.available,
          yield_balance: treasuryBalance.yield,
          current_strategy: {
            strategy_type: 1,
            name: "Aries Markets",
            apy: currentAPY,
            risk_level: 1,
            min_deposit: 1000000,
            is_active: true,
            protocol_address: "0x1"
          },
          emergency_reserve_ratio: 200,
          auto_compound: true,
          last_yield_calculation: Date.now(),
          total_yield_earned: treasuryBalance.totalYield,
          is_emergency_locked: false
        },
        currentAPY,
        recentBatches: [], // Would fetch recent batches
        monthlyPayroll: 0, // Would calculate from recent batches
        costSavings: 0, // Would calculate savings
        complianceStatus: {
          kycCompliance: 100,
          amlFlags: 0,
          auditTrailEntries: 0,
          lastReportGenerated: Date.now()
        }
      };

      setDashboardData(dashboardData);
    } catch (err) {
      handleError(err, "DASHBOARD_ERROR", "Failed to refresh dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [client, isConnected, handleError]);

  const addEmployee = useCallback(async (employeeData: {
    address: string;
    salaryAmount: number;
    preferredCurrency: string;
    paymentSchedule: number;
  }): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.addEmployee(
        currentAccount,
        employeeData.address,
        employeeData.salaryAmount,
        employeeData.preferredCurrency,
        employeeData.paymentSchedule
      );

      return { hash, success: true };
    } catch (err) {
      handleError(err, "ADD_EMPLOYEE_ERROR", "Failed to add employee");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  const createPayrollBatch = useCallback(async (
    employeeAddresses: string[],
    amounts: number[],
    currency: string
  ): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.createPayrollBatch(
        currentAccount,
        employeeAddresses,
        amounts,
        currency
      );

      return { hash, success: true };
    } catch (err) {
      handleError(err, "CREATE_BATCH_ERROR", "Failed to create payroll batch");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  const executePayroll = useCallback(async (batchId: number): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.executePayroll(currentAccount, batchId);
      return { hash, success: true };
    } catch (err) {
      handleError(err, "EXECUTE_PAYROLL_ERROR", "Failed to execute payroll");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  const depositToTreasury = useCallback(async (
    amount: number,
    currency: string,
    strategyType: number
  ): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.depositTreasuryFunds(
        currentAccount,
        amount,
        currency,
        strategyType
      );

      return { hash, success: true };
    } catch (err) {
      handleError(err, "DEPOSIT_TREASURY_ERROR", "Failed to deposit to treasury");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  const withdrawFromTreasury = useCallback(async (
    amount: number,
    currency: string
  ): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.withdrawForPayroll(currentAccount, amount, currency);
      return { hash, success: true };
    } catch (err) {
      handleError(err, "WITHDRAW_TREASURY_ERROR", "Failed to withdraw from treasury");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  const submitKYC = useCallback(async (
    jurisdiction: string,
    verificationLevel: number,
    documentsHash: Uint8Array
  ): Promise<TransactionResult> => {
    if (!client || !currentAccount) {
      throw new Error("Client or account not available");
    }

    try {
      const hash = await client.submitKYC(
        currentAccount,
        jurisdiction,
        verificationLevel,
        documentsHash
      );

      return { hash, success: true };
    } catch (err) {
      handleError(err, "SUBMIT_KYC_ERROR", "Failed to submit KYC");
      return { hash: "", success: false, error: (err as Error).message };
    }
  }, [client, currentAccount, handleError]);

  // Utility functions
  const fundAccount = useCallback(async (amount: number = 100000000): Promise<boolean> => {
    if (!client || !currentAccount) return false;

    try {
      return await client.fundAccount(currentAccount, amount);
    } catch (err) {
      handleError(err, "FUND_ACCOUNT_ERROR", "Failed to fund account");
      return false;
    }
  }, [client, currentAccount, handleError]);

  const getBalance = useCallback(async (address?: string): Promise<number> => {
    if (!client) return 0;

    try {
      const targetAddress = address || wallet?.address;
      if (!targetAddress) return 0;

      return await client.getAccountBalance(targetAddress);
    } catch (err) {
      handleError(err, "GET_BALANCE_ERROR", "Failed to get balance");
      return 0;
    }
  }, [client, wallet?.address, handleError]);

  // View-only functions that don't require account
  const getEmployees = useCallback(async (): Promise<Employee[]> => {
    // This would need to be implemented with proper event querying or additional view functions
    return [];
  }, []);

  const getBatches = useCallback(async (): Promise<PayrollBatch[]> => {
    // This would need to be implemented with proper event querying or additional view functions
    return [];
  }, []);

  const getBatchStatus = useCallback(async (batchId: number): Promise<number> => {
    if (!client) return 3; // Failed status

    try {
      return await client.getBatchStatus(batchId);
    } catch (err) {
      handleError(err, "GET_BATCH_STATUS_ERROR", "Failed to get batch status");
      return 3;
    }
  }, [client, handleError]);

  const getTreasuryData = useCallback(async (): Promise<TreasuryData> => {
    if (!client) {
      throw new Error("Client not available");
    }

    try {
      const balance = await client.getTreasuryBalance();
      const apy = await client.getCurrentAPY();

      return {
        total_deposits: balance.available + balance.yield,
        available_balance: balance.available,
        yield_balance: balance.yield,
        current_strategy: {
          strategy_type: 1,
          name: "Aries Markets",
          apy,
          risk_level: 1,
          min_deposit: 1000000,
          is_active: true,
          protocol_address: "0x1"
        },
        emergency_reserve_ratio: 200,
        auto_compound: true,
        last_yield_calculation: Date.now(),
        total_yield_earned: balance.totalYield,
        is_emergency_locked: false
      };
    } catch (err) {
      handleError(err, "GET_TREASURY_ERROR", "Failed to get treasury data");
      throw err;
    }
  }, [client, handleError]);

  const getCurrentAPY = useCallback(async (): Promise<number> => {
    if (!client) return 0;

    try {
      return await client.getCurrentAPY();
    } catch (err) {
      handleError(err, "GET_APY_ERROR", "Failed to get current APY");
      return 0;
    }
  }, [client, handleError]);

  const getKYCStatus = useCallback(async (address: string): Promise<number> => {
    if (!client) return 0;

    try {
      return await client.getKYCStatus(address);
    } catch (err) {
      handleError(err, "GET_KYC_STATUS_ERROR", "Failed to get KYC status");
      return 0;
    }
  }, [client, handleError]);

  return {
    // Client and connection
    client,
    wallet,
    isConnected,
    isLoading,
    error,

    // Connection methods
    connect,
    disconnect,

    // Dashboard
    dashboardData,
    refreshDashboard,

    // Employee management
    addEmployee,
    getEmployees,

    // Payroll operations
    createPayrollBatch,
    executePayroll,
    getBatches,
    getBatchStatus,

    // Treasury management
    depositToTreasury,
    withdrawFromTreasury,
    getTreasuryData,
    getCurrentAPY,

    // Compliance
    submitKYC,
    getKYCStatus,

    // Utilities
    fundAccount,
    getBalance
  };
};

export default useAPTpay;