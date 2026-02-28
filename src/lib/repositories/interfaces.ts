import {
  User,
  Group,
  GroupMember,
  Expense,
  ExpensePayer,
  ExpenseSplit,
  ActivityLog,
  CurrencyRate,
} from '@/types';

/**
 * User Repository Interface
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Omit<User, 'user_id'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Group Repository Interface
 */
export interface IGroupRepository {
  findById(id: string): Promise<Group | null>;
  findByUserId(userId: string, status?: 'active' | 'archived'): Promise<Group[]>;
  create(group: Omit<Group, 'group_id'>): Promise<Group>;
  update(id: string, data: Partial<Group>): Promise<Group | null>;
}

/**
 * Group Member Repository Interface
 */
export interface IGroupMemberRepository {
  findByGroupId(groupId: string): Promise<GroupMember[]>;
  findByUserId(userId: string): Promise<GroupMember[]>;
  findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null>;
  create(member: Omit<GroupMember, 'membership_id'>): Promise<GroupMember>;
  update(id: string, data: Partial<GroupMember>): Promise<GroupMember | null>;
  remove(id: string): Promise<boolean>;
}

/**
 * Expense Repository Interface
 */
export interface IExpenseRepository {
  findById(id: string): Promise<Expense | null>;
  findByGroupId(groupId: string): Promise<Expense[]>;
  create(expense: Omit<Expense, 'expense_id'>): Promise<Expense>;
  update(id: string, data: Partial<Expense>): Promise<Expense | null>;
  softDelete(id: string): Promise<boolean>;
}

/**
 * Expense Payer Repository Interface
 */
export interface IExpensePayerRepository {
  findByExpenseId(expenseId: string): Promise<ExpensePayer[]>;
  createMany(payers: Omit<ExpensePayer, 'payer_entry_id'>[]): Promise<ExpensePayer[]>;
  deleteByExpenseId(expenseId: string): Promise<boolean>;
}

/**
 * Expense Split Repository Interface
 */
export interface IExpenseSplitRepository {
  findByExpenseId(expenseId: string): Promise<ExpenseSplit[]>;
  createMany(splits: Omit<ExpenseSplit, 'split_entry_id'>[]): Promise<ExpenseSplit[]>;
  deleteByExpenseId(expenseId: string): Promise<boolean>;
}

/**
 * Activity Log Repository Interface
 */
export interface IActivityLogRepository {
  findByExpenseId(expenseId: string): Promise<ActivityLog[]>;
  findByGroupId(groupId: string): Promise<ActivityLog[]>;
  findByUserGroups(userId: string, groupIds: string[]): Promise<ActivityLog[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(log: Record<string, any>): Promise<ActivityLog>;
}

/**
 * Currency Rate Repository Interface
 */
export interface ICurrencyRateRepository {
  findRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate | null>;
  findAll(): Promise<CurrencyRate[]>;
}
