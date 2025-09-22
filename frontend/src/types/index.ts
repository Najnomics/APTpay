// Core Types for APTpay Platform

export interface Employee {
  id: number;
  address: string;
  name?: string;
  salary_amount: number;
  preferred_currency: string;
  payment_schedule: PaymentSchedule;
  is_active: boolean;
  joined_at: number;
  last_payment_at: number;
  location?: string;
  department?: string;
}

export interface PayrollBatch {
  id: number;
  created_by: string;
  employee_payments: EmployeePayment[];
  total_amount: number;
  currency: string;
  status: BatchStatus;
  created_at: number;
  executed_at: number;
  payment_count: number;
  successful_payments: number;
  failed_payments: number;
}

export interface EmployeePayment {
  payment_id: number;
  employee_id: number;
  employee_address: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  executed_at: number;
  tx_hash: string;
}

export interface TreasuryData {
  total_deposits: number;
  available_balance: number;
  yield_balance: number;
  current_strategy: YieldStrategy;
  emergency_reserve_ratio: number;
  auto_compound: boolean;
  last_yield_calculation: number;
  total_yield_earned: number;
  is_emergency_locked: boolean;
}

export interface YieldStrategy {
  strategy_type: StrategyType;
  name: string;
  apy: number; // in basis points
  risk_level: RiskLevel;
  min_deposit: number;
  is_active: boolean;
  protocol_address: string;
}

export interface CurrencyPair {
  from_currency: string;
  to_currency: string;
  is_active: boolean;
  min_swap_amount: number;
  max_swap_amount: number;
  fee_basis_points: number;
}

export interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  dex_source: DEXProtocol;
  timestamp: number;
  liquidity_depth: number;
  is_valid: boolean;
}

export interface KYCRecord {
  id: number;
  entity: string;
  status: KYCStatus;
  verification_level: VerificationLevel;
  jurisdiction: string;
  verified_at: number;
  expires_at: number;
  verified_by: string;
  risk_score: number;
}

export interface AuditEntry {
  id: number;
  transaction_type: TransactionType;
  entity: string;
  amount: number;
  currency: string;
  counterparty: string;
  jurisdiction: string;
  compliance_status: string;
  timestamp: number;
  metadata: string;
  is_suspicious: boolean;
}

// Enums
export enum PaymentSchedule {
  MONTHLY = 0,
  BI_WEEKLY = 1,
  WEEKLY = 2
}

export enum BatchStatus {
  PENDING = 0,
  EXECUTING = 1,
  COMPLETED = 2,
  FAILED = 3
}

export enum PaymentStatus {
  PENDING = 0,
  SUCCESS = 1,
  FAILED = 2
}

export enum StrategyType {
  NONE = 0,
  LENDING = 1,
  LIQUID_STAKING = 2,
  STABLE_VAULT = 3
}

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

export enum DEXProtocol {
  MERKLE = 0,
  HYPERION = 1,
  TAPP = 2
}

export enum KYCStatus {
  PENDING = 0,
  VERIFIED = 1,
  REJECTED = 2,
  EXPIRED = 3
}

export enum VerificationLevel {
  BASIC = 1,
  ENHANCED = 2,
  PREMIUM = 3
}

export enum TransactionType {
  PAYROLL = 0,
  TREASURY = 1,
  FOREX = 2,
  WITHDRAWAL = 3
}

export enum UserRole {
  ADMIN = 0,
  PAYROLL_MANAGER = 1,
  TREASURY_MANAGER = 2,
  AUDITOR = 3,
  EMPLOYEE = 4
}

// UI State Types
export interface DashboardData {
  employeeCount: number;
  treasuryBalance: TreasuryData;
  currentAPY: number;
  recentBatches: PayrollBatch[];
  monthlyPayroll: number;
  costSavings: number;
  complianceStatus: ComplianceStatus;
}

export interface ComplianceStatus {
  kycCompliance: number; // percentage
  amlFlags: number;
  auditTrailEntries: number;
  lastReportGenerated: number;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TransactionResult {
  hash: string;
  success: boolean;
  gas_used?: number;
  error?: string;
}

// Configuration Types
export interface APTpayConfiguration {
  packageAddress: string;
  network: "mainnet" | "testnet" | "devnet" | "local";
  supportedCurrencies: string[];
  defaultSlippageTolerance: number;
  emergencyReserveRatio: number;
  maxBatchSize: number;
}

// Wallet Integration Types
export interface WalletConnection {
  address: string;
  publicKey: string;
  isConnected: boolean;
  network: string;
  balance: number;
}

// Analytics Types
export interface PayrollAnalytics {
  totalVolumeUSD: number;
  averagePaymentSize: number;
  costSavingsPercent: number;
  processingTimeMinutes: number;
  successRate: number;
  topCurrencies: CurrencyStats[];
  monthlyTrends: MonthlyTrend[];
}

export interface CurrencyStats {
  currency: string;
  volume: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  volume: number;
  transactionCount: number;
  averageAPY: number;
  yieldEarned: number;
}

// Error Types
export interface APTpayError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Form Types
export interface AddEmployeeForm {
  address: string;
  name: string;
  salaryAmount: number;
  preferredCurrency: string;
  paymentSchedule: PaymentSchedule;
  department: string;
  location: string;
}

export interface CreateBatchForm {
  employees: {
    address: string;
    amount: number;
  }[];
  currency: string;
  scheduledDate?: number;
}

export interface TreasuryDepositForm {
  amount: number;
  currency: string;
  strategyType: StrategyType;
}

// Export utility type helpers
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;