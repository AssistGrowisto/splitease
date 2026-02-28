// User-related types
export type UserStatus = 'active' | 'suspended';

export interface User {
  user_id: string;
  email: string;
  display_name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  status: UserStatus;
}

// Group-related types
export type GroupStatus = 'active' | 'archived';
export type MemberRole = 'creator' | 'member';

export interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  base_currency: string;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  membership_id: string;
  group_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  removed_at: string | null;
  status: 'active' | 'removed';
}

// Expense-related types
export type SplitType = 'equal' | 'custom' | 'percentage';
export type ExpenseStatus = 'active' | 'deleted';
export type ActionType = 'created' | 'edited' | 'deleted' | 'settled';

export interface Expense {
  expense_id: string;
  group_id: string;
  description: string;
  total_amount: number;
  currency: string;
  converted_amount: number;
  conversion_rate: number;
  split_type: SplitType;
  expense_date: string;
  created_by: string;
  receipt_url: string | null;
  is_settlement: boolean;
  status: ExpenseStatus;
  created_at: string;
  updated_at: string;
}

export interface ExpensePayer {
  payer_entry_id: string;
  expense_id: string;
  user_id: string;
  amount_paid: number;
}

export interface ExpenseSplit {
  split_entry_id: string;
  expense_id: string;
  user_id: string;
  split_amount: number;
  split_percentage: number;
}

// Activity and logging types
export interface ActivityLog {
  log_id: string;
  expense_id: string | null;
  group_id: string;
  user_id: string;
  action: ActionType;
  details: Record<string, any>;
  timestamp: string;
}

// Currency types
export interface CurrencyRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  updated_at: string;
}

// API Response types
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// JWT types
export interface JwtPayload {
  user_id: string;
  email: string;
  iat: number;
  exp: number;
}

// Balance and settlement types
export interface SimplifiedDebt {
  from_user_id: string;
  from_display_name: string;
  to_user_id: string;
  to_display_name: string;
  amount: number;
}

export interface BalanceSummary {
  user_id: string;
  display_name: string;
  net_balance: number;
}

export interface GroupBalanceResponse {
  balances: BalanceSummary[];
  simplified_debts: SimplifiedDebt[];
  total_spending: number;
}

// Currency support
export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}
