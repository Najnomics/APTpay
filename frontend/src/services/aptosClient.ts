import { AptosClient, AptosAccount, FaucetClient, Types } from "aptos";

export interface APTpayConfig {
  nodeUrl: string;
  faucetUrl?: string;
  packageAddress: string;
  network: "mainnet" | "testnet" | "devnet" | "local";
}

export class APTpayClient {
  private client: AptosClient;
  private faucetClient?: FaucetClient;
  private config: APTpayConfig;

  constructor(config: APTpayConfig) {
    this.config = config;
    this.client = new AptosClient(config.nodeUrl);
    
    if (config.faucetUrl) {
      this.faucetClient = new FaucetClient(config.nodeUrl, config.faucetUrl);
    }
  }

  // Account Management
  async getAccountBalance(address: string): Promise<number> {
    try {
      const balance = await this.client.getAccountBalance(address);
      return parseInt(balance);
    } catch (error) {
      console.error("Error getting account balance:", error);
      return 0;
    }
  }

  async fundAccount(account: AptosAccount, amount: number = 100000000): Promise<boolean> {
    if (!this.faucetClient) {
      throw new Error("Faucet not available for this network");
    }

    try {
      await this.faucetClient.fundAccount(account.address(), amount);
      return true;
    } catch (error) {
      console.error("Error funding account:", error);
      return false;
    }
  }

  // Payroll Module Functions
  async addEmployee(
    managerAccount: AptosAccount,
    employeeAddress: string,
    salaryAmount: number,
    preferredCurrency: string,
    paymentSchedule: number
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::payroll_module::add_employee`,
      type_arguments: [],
      arguments: [
        employeeAddress,
        salaryAmount.toString(),
        preferredCurrency,
        paymentSchedule.toString()
      ]
    };

    return this.submitTransaction(managerAccount, payload);
  }

  async createPayrollBatch(
    managerAccount: AptosAccount,
    employeeAddresses: string[],
    amounts: number[],
    currency: string
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::payroll_module::create_employee_batch`,
      type_arguments: [],
      arguments: [
        employeeAddresses,
        amounts.map(a => a.toString()),
        currency
      ]
    };

    return this.submitTransaction(managerAccount, payload);
  }

  async executePayroll(
    managerAccount: AptosAccount,
    batchId: number,
    coinType: string = "0x1::aptos_coin::AptosCoin"
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::payroll_module::execute_payroll`,
      type_arguments: [coinType],
      arguments: [batchId.toString()]
    };

    return this.submitTransaction(managerAccount, payload);
  }

  // Treasury Module Functions
  async depositTreasuryFunds(
    managerAccount: AptosAccount,
    amount: number,
    currency: string,
    strategyType: number,
    coinType: string = "0x1::aptos_coin::AptosCoin"
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::treasury_module::deposit_treasury_funds`,
      type_arguments: [coinType],
      arguments: [
        amount.toString(),
        currency,
        strategyType.toString()
      ]
    };

    return this.submitTransaction(managerAccount, payload);
  }

  async withdrawForPayroll(
    managerAccount: AptosAccount,
    amount: number,
    currency: string,
    coinType: string = "0x1::aptos_coin::AptosCoin"
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::treasury_module::withdraw_for_payroll`,
      type_arguments: [coinType],
      arguments: [
        amount.toString(),
        currency
      ]
    };

    return this.submitTransaction(managerAccount, payload);
  }

  // Forex Module Functions
  async executeSwap(
    userAccount: AptosAccount,
    fromCurrency: string,
    toCurrency: string,
    inputAmount: number,
    minOutputAmount: number,
    batchId: number,
    fromCoinType: string,
    toCoinType: string
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::forex_module::execute_swap`,
      type_arguments: [fromCoinType, toCoinType],
      arguments: [
        fromCurrency,
        toCurrency,
        inputAmount.toString(),
        minOutputAmount.toString(),
        batchId.toString()
      ]
    };

    return this.submitTransaction(userAccount, payload);
  }

  // Access Control Functions
  async grantRole(
    adminAccount: AptosAccount,
    userAddress: string,
    role: number
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::access_control::grant_role`,
      type_arguments: [],
      arguments: [
        userAddress,
        role.toString()
      ]
    };

    return this.submitTransaction(adminAccount, payload);
  }

  // Compliance Functions
  async submitKYC(
    entityAccount: AptosAccount,
    jurisdiction: string,
    verificationLevel: number,
    documentsHash: Uint8Array
  ): Promise<string> {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.config.packageAddress}::compliance_module::submit_kyc`,
      type_arguments: [],
      arguments: [
        jurisdiction,
        verificationLevel.toString(),
        Array.from(documentsHash)
      ]
    };

    return this.submitTransaction(entityAccount, payload);
  }

  // View Functions
  async getEmployeeCount(): Promise<number> {
    try {
      const result = await this.client.view({
        function: `${this.config.packageAddress}::payroll_module::get_employee_count`,
        type_arguments: [],
        arguments: []
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error("Error getting employee count:", error);
      return 0;
    }
  }

  async getTreasuryBalance(): Promise<{ available: number, yield: number, totalYield: number }> {
    try {
      const result = await this.client.view({
        function: `${this.config.packageAddress}::treasury_module::get_treasury_balance`,
        type_arguments: [],
        arguments: []
      });
      return {
        available: parseInt(result[0] as string),
        yield: parseInt(result[1] as string),
        totalYield: parseInt(result[2] as string)
      };
    } catch (error) {
      console.error("Error getting treasury balance:", error);
      return { available: 0, yield: 0, totalYield: 0 };
    }
  }

  async getCurrentAPY(): Promise<number> {
    try {
      const result = await this.client.view({
        function: `${this.config.packageAddress}::treasury_module::get_current_apy`,
        type_arguments: [],
        arguments: []
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error("Error getting current APY:", error);
      return 0;
    }
  }

  async getBatchStatus(batchId: number): Promise<number> {
    try {
      const result = await this.client.view({
        function: `${this.config.packageAddress}::payroll_module::get_batch_status`,
        type_arguments: [],
        arguments: [batchId.toString()]
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error("Error getting batch status:", error);
      return 3; // Failed status
    }
  }

  async getKYCStatus(entityAddress: string): Promise<number> {
    try {
      const result = await this.client.view({
        function: `${this.config.packageAddress}::compliance_module::get_kyc_status`,
        type_arguments: [],
        arguments: [entityAddress]
      });
      return parseInt(result[0] as string);
    } catch (error) {
      console.error("Error getting KYC status:", error);
      return 0; // Pending status
    }
  }

  // Utility Functions
  private async submitTransaction(
    account: AptosAccount,
    payload: Types.TransactionPayload
  ): Promise<string> {
    try {
      const txnRequest = await this.client.generateTransaction(account.address(), payload);
      const signedTxn = await this.client.signTransaction(account, txnRequest);
      const transactionRes = await this.client.submitTransaction(signedTxn);
      await this.client.waitForTransaction(transactionRes.hash);
      return transactionRes.hash;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  }

  async getEvents(
    eventHandle: string,
    fieldName: string,
    limit?: number
  ): Promise<Types.Event[]> {
    try {
      return await this.client.getEventsByEventHandle(
        this.config.packageAddress,
        eventHandle,
        fieldName,
        { limit }
      );
    } catch (error) {
      console.error("Error getting events:", error);
      return [];
    }
  }

  // Configuration helpers
  static getDefaultConfig(network: "mainnet" | "testnet" | "devnet" | "local"): APTpayConfig {
    const configs = {
      mainnet: {
        nodeUrl: "https://fullnode.mainnet.aptoslabs.com/v1",
        packageAddress: "0x1", // Replace with actual deployed address
        network: "mainnet" as const
      },
      testnet: {
        nodeUrl: "https://fullnode.testnet.aptoslabs.com/v1",
        faucetUrl: "https://faucet.testnet.aptoslabs.com",
        packageAddress: "0x1", // Replace with actual deployed address
        network: "testnet" as const
      },
      devnet: {
        nodeUrl: "https://fullnode.devnet.aptoslabs.com/v1",
        faucetUrl: "https://faucet.devnet.aptoslabs.com",
        packageAddress: "0x1", // Replace with actual deployed address
        network: "devnet" as const
      },
      local: {
        nodeUrl: "http://localhost:8080/v1",
        faucetUrl: "http://localhost:8081",
        packageAddress: "0x1", // Replace with actual deployed address
        network: "local" as const
      }
    };

    return configs[network];
  }
}

export default APTpayClient;