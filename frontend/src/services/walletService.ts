import { Types } from 'aptos';

export interface WalletState {
  connected: boolean;
  address: string | null;
  publicKey: string | null;
  network: string;
  balance: number;
}

export interface WalletAdapter {
  name: string;
  icon: string;
  url: string;
  connect(): Promise<WalletState>;
  disconnect(): Promise<void>;
  signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<string>;
  signMessage(message: string): Promise<string>;
}

class AptosWalletService {
  private currentWallet: WalletAdapter | null = null;
  private state: WalletState = {
    connected: false,
    address: null,
    publicKey: null,
    network: 'devnet',
    balance: 0
  };

  // Supported wallet adapters
  private wallets: WalletAdapter[] = [
    {
      name: 'Petra',
      icon: '🪨',
      url: 'https://petra.app/',
      connect: async () => {
        if (typeof window !== 'undefined' && 'aptos' in window) {
          try {
            const response = await (window as any).aptos.connect();
            const account = await (window as any).aptos.account();
            const balance = await this.getBalance(account.address);
            
            this.state = {
              connected: true,
              address: account.address,
              publicKey: account.publicKey,
              network: 'devnet',
              balance
            };
            
            return this.state;
          } catch (error) {
            throw new Error('Failed to connect to Petra wallet');
          }
        }
        throw new Error('Petra wallet not found');
      },
      disconnect: async () => {
        if (typeof window !== 'undefined' && 'aptos' in window) {
          await (window as any).aptos.disconnect();
          this.resetState();
        }
      },
      signAndSubmitTransaction: async (transaction: Types.TransactionPayload) => {
        if (typeof window !== 'undefined' && 'aptos' in window) {
          const response = await (window as any).aptos.signAndSubmitTransaction(transaction);
          return response.hash;
        }
        throw new Error('Petra wallet not available');
      },
      signMessage: async (message: string) => {
        if (typeof window !== 'undefined' && 'aptos' in window) {
          const response = await (window as any).aptos.signMessage({
            message,
            nonce: Date.now().toString()
          });
          return response.signature;
        }
        throw new Error('Petra wallet not available');
      }
    },
    {
      name: 'Martian',
      icon: '👽',
      url: 'https://martianwallet.xyz/',
      connect: async () => {
        if (typeof window !== 'undefined' && 'martian' in window) {
          try {
            const response = await (window as any).martian.connect();
            const account = await (window as any).martian.account();
            const balance = await this.getBalance(account.address);
            
            this.state = {
              connected: true,
              address: account.address,
              publicKey: account.publicKey,
              network: 'devnet',
              balance
            };
            
            return this.state;
          } catch (error) {
            throw new Error('Failed to connect to Martian wallet');
          }
        }
        throw new Error('Martian wallet not found');
      },
      disconnect: async () => {
        if (typeof window !== 'undefined' && 'martian' in window) {
          await (window as any).martian.disconnect();
          this.resetState();
        }
      },
      signAndSubmitTransaction: async (transaction: Types.TransactionPayload) => {
        if (typeof window !== 'undefined' && 'martian' in window) {
          const response = await (window as any).martian.signAndSubmitTransaction(transaction);
          return response.hash;
        }
        throw new Error('Martian wallet not available');
      },
      signMessage: async (message: string) => {
        if (typeof window !== 'undefined' && 'martian' in window) {
          const response = await (window as any).martian.signMessage({
            message,
            nonce: Date.now().toString()
          });
          return response.signature;
        }
        throw new Error('Martian wallet not available');
      }
    }
  ];

  private resetState() {
    this.state = {
      connected: false,
      address: null,
      publicKey: null,
      network: 'devnet',
      balance: 0
    };
    this.currentWallet = null;
  }

  async getBalance(address: string): Promise<number> {
    try {
      const response = await fetch(`https://fullnode.devnet.aptoslabs.com/v1/accounts/${address}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`);
      const data = await response.json();
      return parseInt(data.data.coin.value) / 100000000; // Convert from Octas to APT
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      return 0;
    }
  }

  getAvailableWallets(): WalletAdapter[] {
    return this.wallets.filter(wallet => {
      if (typeof window === 'undefined') return false;
      
      switch (wallet.name) {
        case 'Petra':
          return 'aptos' in window;
        case 'Martian':
          return 'martian' in window;
        default:
          return false;
      }
    });
  }

  async connectWallet(walletName: string): Promise<WalletState> {
    const wallet = this.wallets.find(w => w.name === walletName);
    if (!wallet) {
      throw new Error(`Wallet ${walletName} not found`);
    }

    this.currentWallet = wallet;
    const state = await wallet.connect();
    
    // Listen for account changes
    this.setupEventListeners();
    
    return state;
  }

  async disconnectWallet(): Promise<void> {
    if (this.currentWallet) {
      await this.currentWallet.disconnect();
    }
    this.resetState();
  }

  getWalletState(): WalletState {
    return { ...this.state };
  }

  async signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<string> {
    if (!this.currentWallet || !this.state.connected) {
      throw new Error('Wallet not connected');
    }
    return await this.currentWallet.signAndSubmitTransaction(transaction);
  }

  async signMessage(message: string): Promise<string> {
    if (!this.currentWallet || !this.state.connected) {
      throw new Error('Wallet not connected');
    }
    return await this.currentWallet.signMessage(message);
  }

  // Advanced wallet functions
  async refreshBalance(): Promise<number> {
    if (this.state.address) {
      this.state.balance = await this.getBalance(this.state.address);
    }
    return this.state.balance;
  }

  async switchNetwork(network: 'mainnet' | 'devnet' | 'testnet'): Promise<void> {
    // Implementation depends on wallet capabilities
    this.state.network = network;
  }

  async addToken(tokenAddress: string): Promise<void> {
    if (!this.currentWallet || !this.state.connected) {
      throw new Error('Wallet not connected');
    }
    // Token addition logic
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Listen for account changes
    if ('aptos' in window) {
      (window as any).aptos.onAccountChange((account: any) => {
        if (account) {
          this.state.address = account.address;
          this.state.publicKey = account.publicKey;
          this.refreshBalance();
        } else {
          this.resetState();
        }
      });

      (window as any).aptos.onNetworkChange((network: any) => {
        this.state.network = network.name || 'devnet';
      });
    }

    if ('martian' in window) {
      (window as any).martian.onAccountChange((account: any) => {
        if (account) {
          this.state.address = account.address;
          this.state.publicKey = account.publicKey;
          this.refreshBalance();
        } else {
          this.resetState();
        }
      });
    }
  }

  // Utility functions
  isWalletInstalled(walletName: string): boolean {
    if (typeof window === 'undefined') return false;
    
    switch (walletName) {
      case 'Petra':
        return 'aptos' in window;
      case 'Martian':
        return 'martian' in window;
      default:
        return false;
    }
  }

  formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async getTransactionHistory(limit: number = 10): Promise<any[]> {
    if (!this.state.address) return [];
    
    try {
      const response = await fetch(
        `https://fullnode.devnet.aptoslabs.com/v1/accounts/${this.state.address}/transactions?limit=${limit}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      return [];
    }
  }

  async estimateGas(transaction: Types.TransactionPayload): Promise<number> {
    if (!this.currentWallet || !this.state.connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const response = await fetch('https://fullnode.devnet.aptoslabs.com/v1/transactions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: this.state.address,
          sequence_number: '0',
          max_gas_amount: '1000000',
          gas_unit_price: '100',
          expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 10).toString(),
          payload: transaction
        })
      });
      
      const simulation = await response.json();
      return parseInt(simulation[0]?.gas_used || '0');
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      return 0;
    }
  }
}

export const walletService = new AptosWalletService();