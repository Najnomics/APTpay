import { AptosService } from './aptosService';

export class PayrollService {
  private aptosService: AptosService;

  constructor() {
    this.aptosService = new AptosService();
  }

  async getDashboardData() {
    const [employeeCount, treasuryBalance, currentAPY] = await Promise.all([
      this.aptosService.getEmployeeCount(),
      this.aptosService.getTreasuryBalance(),
      this.aptosService.getCurrentAPY()
    ]);

    return {
      employeeCount,
      treasuryBalance: this.aptosService.formatCurrency(treasuryBalance.available),
      activeYield: this.aptosService.formatPercentage(currentAPY),
      nextPayroll: this.getNextPayrollDate(),
      systemStatus: '✅ All Systems Operational'
    };
  }

  async getEmployeeList() {
    // Mock data - in production would fetch from contract
    return [
      { name: 'Alice Johnson', role: 'Senior Developer', salary: '8,500 USDC', status: 'Active' },
      { name: 'Bob Smith', role: 'Product Manager', salary: '7,200 USDC', status: 'Active' },
      { name: 'Carol Davis', role: 'Designer', salary: '6,800 USDC', status: 'Active' },
      { name: 'David Wilson', role: 'DevOps Engineer', salary: '7,500 USDC', status: 'Active' },
      { name: 'Eve Brown', role: 'QA Engineer', salary: '6,200 USDC', status: 'Active' }
    ];
  }

  async getPayrollStatus() {
    return {
      lastPayroll: this.getLastPayrollDate(),
      nextPayroll: this.getNextPayrollDate(),
      pendingAmount: '36,200 USDC',
      readyToExecute: true,
      employeesCount: await this.aptosService.getEmployeeCount()
    };
  }

  showPayrollMenu(ctx: any) {
    return ctx.reply('💼 *Payroll Management*\n\nSelect an option:', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '👥 View Employees', callback_data: 'employees' }],
          [{ text: '⚡ Execute Payroll', callback_data: 'execute_payroll' }],
          [{ text: '➕ Add Employee', callback_data: 'add_employee' }],
          [{ text: '📊 Payroll History', callback_data: 'payroll_history' }],
          [{ text: '🔙 Back to Dashboard', callback_data: 'dashboard' }]
        ]
      }
    });
  }

  private getNextPayrollDate(): string {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  private getLastPayrollDate(): string {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return lastMonth.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}