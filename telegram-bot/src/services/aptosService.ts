export class AptosService {
  private contractAddress: string;

  constructor() {
    this.contractAddress = process.env.CONTRACT_ADDRESS || '0x7ccdab8fecaff6c2954dedcf2c82fcdf9eefd369f105ca45c1897b783bd2202b';
  }

  async getEmployeeCount(): Promise<number> {
    // Mock data for demo
    return 5;
  }

  async getTreasuryBalance(): Promise<{ available: number, yield: number, totalYield: number }> {
    // Mock data for demo
    return {
      available: 1250000,
      yield: 4375,
      totalYield: 52500
    };
  }

  async getCurrentAPY(): Promise<number> {
    // Mock data for demo - 4.2% as basis points
    return 420;
  }

  async getForexRates(): Promise<any[]> {
    try {
      // Mock data for demo - in production would call actual contract
      return [
        { pair: 'USD/EUR', rate: 0.85, change: '+0.02%' },
        { pair: 'USD/GBP', rate: 0.73, change: '-0.01%' },
        { pair: 'USD/JPY', rate: 110.25, change: '+0.15%' },
        { pair: 'EUR/GBP', rate: 0.86, change: '+0.03%' }
      ];
    } catch (error) {
      console.error('Error getting forex rates:', error);
      return [];
    }
  }

  formatCurrency(amount: number, currency: string = 'USDC'): string {
    return `${amount.toLocaleString()} ${currency}`;
  }

  formatPercentage(value: number): string {
    return `${(value / 100).toFixed(2)}%`;
  }
}