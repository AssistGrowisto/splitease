import { google } from 'googleapis';
import { nanoid } from 'nanoid';
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
import {
  IUserRepository,
  IGroupRepository,
  IGroupMemberRepository,
  IExpenseRepository,
  IExpensePayerRepository,
  IExpenseSplitRepository,
  IActivityLogRepository,
  ICurrencyRateRepository,
} from './interfaces';
import { config } from '@/lib/config';

/**
 * Tab names in the Google Sheets document
 */
const TABS = {
  USERS: 'Users',
  GROUPS: 'Groups',
  GROUP_MEMBERS: 'Group_Members',
  EXPENSES: 'Expenses',
  EXPENSE_PAYERS: 'Expense_Payers',
  EXPENSE_SPLITS: 'Expense_Splits',
  ACTIVITY_LOG: 'Activity_Log',
  CURRENCY_RATES: 'Currency_Rates',
} as const;

/**
 * GoogleSheetsBase - Base class for Google Sheets integration
 */
class GoogleSheetsBase {
  protected sheets = google.sheets('v4');
  protected auth;
  protected spreadsheetId: string;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.google.serviceAccountEmail,
        private_key: (() => { const pk = config.google.privateKey || ''; if (pk.startsWith('-----BEGIN')) return pk; try { const decoded = Buffer.from(pk, 'base64').toString('utf-8'); if (decoded.startsWith('-----BEGIN')) return decoded; } catch(e) {} return pk.replace(/\\n/g, '\n'); })(),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.spreadsheetId = config.google.sheetId;
  }

  /**
   * Get all data from a sheet tab
   */
  protected async getSheetData(tabName: string): Promise<any[][]> {
    const response = await this.sheets.spreadsheets.values.get({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range: tabName,
    });

    return response.data.values || [];
  }

  /**
   * Get headers from a sheet tab
   */
  protected async getHeaders(tabName: string): Promise<string[]> {
    const data = await this.getSheetData(tabName);
    return data.length > 0 ? data[0] : [];
  }

  /**
   * Append a row to a sheet
   */
  protected async appendRow(tabName: string, values: any[]): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });
  }

  /**
   * Update a specific row in a sheet
   * rowIndex is the data row (0-indexed), which corresponds to sheet row (rowIndex + 2)
   */
  protected async updateRow(
    tabName: string,
    rowIndex: number,
    values: any[]
  ): Promise<void> {
    const sheetRow = rowIndex + 2; // +1 for header, +1 for 1-based indexing
    const range = `${tabName}!A${sheetRow}:Z${sheetRow}`;

    await this.sheets.spreadsheets.values.update({
      auth: this.auth,
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });
  }

  /**
   * Convert row array to object using headers
   */
  protected rowToObject(headers: string[], row: any[]): Record<string, any> {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || null;
    });
    return obj;
  }

  /**
   * Convert object to row array using headers
   */
  protected objectToRow(headers: string[], obj: Record<string, any>): any[] {
    return headers.map((header) => obj[header] ?? '');
  }
}

/**
 * Google Sheets User Repository
 */
export class GoogleSheetsUserRepo extends GoogleSheetsBase implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const data = await this.getSheetData(TABS.USERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.user_id === id) {
        return this.parseUser(obj);
      }
    }

    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.getSheetData(TABS.USERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.email === email) {
        return this.parseUser(obj);
      }
    }

    return null;
  }

  async findAll(): Promise<User[]> {
    const data = await this.getSheetData(TABS.USERS);
    const headers = data[0] || [];
    const users: User[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      users.push(this.parseUser(obj));
    }

    return users;
  }

  async create(user: Omit<User, 'user_id'>): Promise<User> {
    const headers = await this.getHeaders(TABS.USERS);
    const user_id = `usr_${nanoid()}`;
    const now = new Date().toISOString();

    const userData = {
      user_id,
      ...user,
      created_at: now,
      updated_at: now,
    };

    const row = this.objectToRow(headers, userData);
    await this.appendRow(TABS.USERS, row);

    return userData as User;
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const sheetData = await this.getSheetData(TABS.USERS);
    const headers = sheetData[0] || [];
    let foundIndex = -1;

    for (let i = 1; i < sheetData.length; i++) {
      const obj = this.rowToObject(headers, sheetData[i]);
      if (obj.user_id === id) {
        foundIndex = i - 1;
        break;
      }
    }

    if (foundIndex === -1) return null;

    const current = this.parseUser(this.rowToObject(headers, sheetData[foundIndex + 1]));
    const updated = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };

    const row = this.objectToRow(headers, updated);
    await this.updateRow(TABS.USERS, foundIndex, row);

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.getSheetData(TABS.USERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.user_id === id) {
        const emptyRow = headers.map(() => '');
        await this.updateRow(TABS.USERS, i - 1, emptyRow);
        return true;
      }
    }

    return false;
  }

  private parseUser(obj: Record<string, any>): User {
    return {
      user_id: obj.user_id,
      email: obj.email,
      display_name: obj.display_name,
      password_hash: obj.password_hash,
      created_at: obj.created_at,
      updated_at: obj.updated_at,
      status: obj.status || 'active',
    };
  }
}

/**
 * Google Sheets Group Repository
 */
export class GoogleSheetsGroupRepo extends GoogleSheetsBase implements IGroupRepository {
  async findById(id: string): Promise<Group | null> {
    const data = await this.getSheetData(TABS.GROUPS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.group_id === id) {
        return this.parseGroup(obj);
      }
    }

    return null;
  }

  async findByUserId(userId: string, status?: 'active' | 'archived'): Promise<Group[]> {
    const data = await this.getSheetData(TABS.GROUPS);
    const headers = data[0] || [];
    const groups: Group[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.created_by === userId) {
        const group = this.parseGroup(obj);
        if (!status || group.status === status) {
          groups.push(group);
        }
      }
    }

    return groups;
  }

  async create(group: Omit<Group, 'group_id'>): Promise<Group> {
    const headers = await this.getHeaders(TABS.GROUPS);
    const group_id = `grp_${nanoid()}`;
    const now = new Date().toISOString();

    const groupData = {
      group_id,
      ...group,
      created_at: now,
      updated_at: now,
    };

    const row = this.objectToRow(headers, groupData);
    await this.appendRow(TABS.GROUPS, row);

    return groupData as Group;
  }

  async update(id: string, data: Partial<Group>): Promise<Group | null> {
    const sheetData = await this.getSheetData(TABS.GROUPS);
    const headers = sheetData[0] || [];
    let foundIndex = -1;

    for (let i = 1; i < sheetData.length; i++) {
      const obj = this.rowToObject(headers, sheetData[i]);
      if (obj.group_id === id) {
        foundIndex = i - 1;
        break;
      }
    }

    if (foundIndex === -1) return null;

    const current = this.parseGroup(this.rowToObject(headers, sheetData[foundIndex + 1]));
    const updated = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };

    const row = this.objectToRow(headers, updated);
    await this.updateRow(TABS.GROUPS, foundIndex, row);

    return updated;
  }

  private parseGroup(obj: Record<string, any>): Group {
    return {
      group_id: obj.group_id,
      group_name: obj.group_name,
      created_by: obj.created_by,
      base_currency: obj.base_currency || 'USD',
      status: obj.status || 'active',
      created_at: obj.created_at,
      updated_at: obj.updated_at,
    };
  }
}

/**
 * Google Sheets Group Member Repository
 */
export class GoogleSheetsGroupMemberRepo
  extends GoogleSheetsBase
  implements IGroupMemberRepository
{
  async findByGroupId(groupId: string): Promise<GroupMember[]> {
    const data = await this.getSheetData(TABS.GROUP_MEMBERS);
    const headers = data[0] || [];
    const members: GroupMember[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.group_id === groupId) {
        members.push(this.parseGroupMember(obj));
      }
    }

    return members;
  }

  async findByUserId(userId: string): Promise<GroupMember[]> {
    const data = await this.getSheetData(TABS.GROUP_MEMBERS);
    const headers = data[0] || [];
    const members: GroupMember[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.user_id === userId) {
        members.push(this.parseGroupMember(obj));
      }
    }

    return members;
  }

  async findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null> {
    const data = await this.getSheetData(TABS.GROUP_MEMBERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.group_id === groupId && obj.user_id === userId) {
        return this.parseGroupMember(obj);
      }
    }

    return null;
  }

  async create(member: Omit<GroupMember, 'membership_id'>): Promise<GroupMember> {
    const headers = await this.getHeaders(TABS.GROUP_MEMBERS);
    const membership_id = `mem_${nanoid()}`;
    const now = new Date().toISOString();

    const memberData = {
      membership_id,
      ...member,
      joined_at: now,
      removed_at: null,
    };

    const row = this.objectToRow(headers, memberData);
    await this.appendRow(TABS.GROUP_MEMBERS, row);

    return memberData as GroupMember;
  }

  async update(id: string, data: Partial<GroupMember>): Promise<GroupMember | null> {
    const sheetData = await this.getSheetData(TABS.GROUP_MEMBERS);
    const headers = sheetData[0] || [];
    let foundIndex = -1;

    for (let i = 1; i < sheetData.length; i++) {
      const obj = this.rowToObject(headers, sheetData[i]);
      if (obj.membership_id === id) {
        foundIndex = i - 1;
        break;
      }
    }

    if (foundIndex === -1) return null;

    const current = this.parseGroupMember(this.rowToObject(headers, sheetData[foundIndex + 1]));
    const updated = {
      ...current,
      ...data,
      removed_at: new Date().toISOString(),
    };

    const row = this.objectToRow(headers, updated);
    await this.updateRow(TABS.GROUP_MEMBERS, foundIndex, row);

    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const data = await this.getSheetData(TABS.GROUP_MEMBERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.membership_id === id) {
        const emptyRow = headers.map(() => '');
        await this.updateRow(TABS.GROUP_MEMBERS, i - 1, emptyRow);
        return true;
      }
    }

    return false;
  }

  private parseGroupMember(obj: Record<string, any>): GroupMember {
    return {
      membership_id: obj.membership_id,
      group_id: obj.group_id,
      user_id: obj.user_id,
      role: obj.role || 'member',
      joined_at: obj.joined_at,
      removed_at: obj.removed_at || null,
      status: obj.status || 'active',
    };
  }
}

/**
 * Google Sheets Expense Repository
 */
export class GoogleSheetsExpenseRepo extends GoogleSheetsBase implements IExpenseRepository {
  async findById(id: string): Promise<Expense | null> {
    const data = await this.getSheetData(TABS.EXPENSES);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expense_id === id && !obj.deletedAt) {
        return this.parseExpense(obj);
      }
    }

    return null;
  }

  async findByGroupId(groupId: string, options?: { active?: boolean }): Promise<Expense[]> {
    const data = await this.getSheetData(TABS.EXPENSES);
    const headers = data[0] || [];
    const expenses: Expense[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.groupId === groupId && !obj.deletedAt) {
        expenses.push(this.parseExpense(obj));
      }
    }

    return expenses;
  }

  async create(expense: Omit<Expense, 'expense_id'>): Promise<Expense> {
    const headers = await this.getHeaders(TABS.EXPENSES);
    const expense_id = `exp_${nanoid()}`;
    const now = new Date().toISOString();

    const expenseData = {
      expense_id,
      ...expense,
      created_at: now,
      updatedAt: now,
    };

    const row = this.objectToRow(headers, expenseData);
    await this.appendRow(TABS.EXPENSES, row);

    return expenseData as Expense;
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense | null> {
    const sheetData = await this.getSheetData(TABS.EXPENSES);
    const headers = sheetData[0] || [];
    let foundIndex = -1;

    for (let i = 1; i < sheetData.length; i++) {
      const obj = this.rowToObject(headers, sheetData[i]);
      if (obj.expense_id === id) {
        foundIndex = i - 1;
        break;
      }
    }

    if (foundIndex === -1) return null;

    const current = this.parseExpense(this.rowToObject(headers, sheetData[foundIndex + 1]));
    const updated = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };

    const row = this.objectToRow(headers, updated);
    await this.updateRow(TABS.EXPENSES, foundIndex, row);

    return updated;
  }

  async softDelete(id: string): Promise<boolean> {
    const data = await this.getSheetData(TABS.EXPENSES);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expense_id === id) {
        const updated = {
          ...obj,
          deletedAt: new Date().toISOString(),
        };
        const row = this.objectToRow(headers, updated);
        await this.updateRow(TABS.EXPENSES, i - 1, row);
        return true;
      }
    }

    return false;
  }

  private parseExpense(obj: Record<string, any>): Expense {
    return {
      expense_id: obj.expense_id,
      group_id: obj.group_id,
      description: obj.description,
      total_amount: parseFloat(obj.total_amount) || 0,
      currency: obj.currency,
      converted_amount: parseFloat(obj.converted_amount) || 0,
      conversion_rate: parseFloat(obj.conversion_rate) || 1,
      split_type: obj.split_type,
      expense_date: obj.expense_date,
      created_by: obj.created_by,
      receipt_url: obj.receipt_url || null,
      is_settlement: obj.is_settlement === 'true' || obj.is_settlement === true,
      status: obj.status || 'active',
      created_at: obj.created_at,
      updated_at: obj.updated_at,
    };
  }
}

/**
 * Google Sheets Expense Payer Repository
 */
export class GoogleSheetsExpensePayerRepo
  extends GoogleSheetsBase
  implements IExpensePayerRepository
{
  async findByExpenseId(expenseId: string): Promise<ExpensePayer[]> {
    const data = await this.getSheetData(TABS.EXPENSE_PAYERS);
    const headers = data[0] || [];
    const payers: ExpensePayer[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expenseId === expenseId) {
        payers.push(this.parseExpensePayer(obj));
      }
    }

    return payers;
  }

  async createMany(payers: Omit<ExpensePayer, 'payer_entry_id'>[]): Promise<ExpensePayer[]> {
    const headers = await this.getHeaders(TABS.EXPENSE_PAYERS);
    const now = new Date().toISOString();
    const results: ExpensePayer[] = [];

    for (const payer of payers) {
      const payer_entry_id = `pay_${nanoid()}`;
      const payerData = {
        payer_entry_id,
        ...payer,
        timestamp: now,
      };

      const row = this.objectToRow(headers, payerData);
      await this.appendRow(TABS.EXPENSE_PAYERS, row);
      results.push(payerData as ExpensePayer);
    }

    return results;
  }

  async deleteByExpenseId(expenseId: string): Promise<boolean> {
    const data = await this.getSheetData(TABS.EXPENSE_PAYERS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expenseId === expenseId) {
        const emptyRow = headers.map(() => '');
        await this.updateRow(TABS.EXPENSE_PAYERS, i - 1, emptyRow);
      }
    }

    return true;
  }

  private parseExpensePayer(obj: Record<string, any>): ExpensePayer {
    return {
      payer_entry_id: obj.payer_entry_id,
      expense_id: obj.expense_id,
      user_id: obj.user_id,
      amount_paid: parseFloat(obj.amount_paid) || 0,
    };
  }
}

/**
 * Google Sheets Expense Split Repository
 */
export class GoogleSheetsExpenseSplitRepo
  extends GoogleSheetsBase
  implements IExpenseSplitRepository
{
  async findByExpenseId(expenseId: string): Promise<ExpenseSplit[]> {
    const data = await this.getSheetData(TABS.EXPENSE_SPLITS);
    const headers = data[0] || [];
    const splits: ExpenseSplit[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expenseId === expenseId) {
        splits.push(this.parseExpenseSplit(obj));
      }
    }

    return splits;
  }

  async createMany(splits: Omit<ExpenseSplit, 'split_entry_id'>[]): Promise<ExpenseSplit[]> {
    const headers = await this.getHeaders(TABS.EXPENSE_SPLITS);
    const now = new Date().toISOString();
    const results: ExpenseSplit[] = [];

    for (const split of splits) {
      const split_entry_id = `spl_${nanoid()}`;
      const splitData = {
        split_entry_id,
        ...split,
        timestamp: now,
      };

      const row = this.objectToRow(headers, splitData);
      await this.appendRow(TABS.EXPENSE_SPLITS, row);
      results.push(splitData as ExpenseSplit);
    }

    return results;
  }

  async deleteByExpenseId(expenseId: string): Promise<boolean> {
    const data = await this.getSheetData(TABS.EXPENSE_SPLITS);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expenseId === expenseId) {
        const emptyRow = headers.map(() => '');
        await this.updateRow(TABS.EXPENSE_SPLITS, i - 1, emptyRow);
      }
    }

    return true;
  }

  private parseExpenseSplit(obj: Record<string, any>): ExpenseSplit {
    return {
      split_entry_id: obj.split_entry_id,
      expense_id: obj.expense_id,
      user_id: obj.user_id,
      split_amount: parseFloat(obj.split_amount) || 0,
      split_percentage: parseFloat(obj.split_percentage) || 0,
    };
  }
}

/**
 * Google Sheets Activity Log Repository
 */
export class GoogleSheetsActivityLogRepo
  extends GoogleSheetsBase
  implements IActivityLogRepository
{
  async findByExpenseId(expenseId: string): Promise<ActivityLog[]> {
    const data = await this.getSheetData(TABS.ACTIVITY_LOG);
    const headers = data[0] || [];
    const logs: ActivityLog[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.expenseId === expenseId) {
        logs.push(this.parseActivityLog(obj));
      }
    }

    return logs;
  }

  async findByGroupId(groupId: string): Promise<ActivityLog[]> {
    const data = await this.getSheetData(TABS.ACTIVITY_LOG);
    const headers = data[0] || [];
    const logs: ActivityLog[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.groupId === groupId) {
        logs.push(this.parseActivityLog(obj));
      }
    }

    return logs;
  }

  async findByUserGroups(userId: string, groupIds: string[]): Promise<ActivityLog[]> {
    const data = await this.getSheetData(TABS.ACTIVITY_LOG);
    const headers = data[0] || [];
    const logs: ActivityLog[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.userId === userId && groupIds.includes(obj.groupId)) {
        logs.push(this.parseActivityLog(obj));
      }
    }

    return logs;
  }

  async create(log: Record<string, any>): Promise<ActivityLog> {
    const headers = await this.getHeaders(TABS.ACTIVITY_LOG);
    const log_id = `log_${nanoid()}`;
    const now = new Date().toISOString();

    const logData = {
      log_id,
      ...log,
      timestamp: now,
    };

    const row = this.objectToRow(headers, logData);
    await this.appendRow(TABS.ACTIVITY_LOG, row);

    return logData as ActivityLog;
  }

  private parseActivityLog(obj: Record<string, any>): ActivityLog {
    return {
      log_id: obj.log_id,
      expense_id: obj.expense_id || null,
      group_id: obj.group_id,
      user_id: obj.user_id,
      action: obj.action,
      details: obj.details ? (typeof obj.details === 'string' ? JSON.parse(obj.details) : obj.details) : {},
      timestamp: obj.timestamp,
    };
  }
}

/**
 * Google Sheets Currency Rate Repository
 */
export class GoogleSheetsCurrencyRateRepo
  extends GoogleSheetsBase
  implements ICurrencyRateRepository
{
  async findRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate | null> {
    const data = await this.getSheetData(TABS.CURRENCY_RATES);
    const headers = data[0] || [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.from_currency === fromCurrency && obj.to_currency === toCurrency) {
        return this.parseCurrencyRate(obj);
      }
    }

    return null;
  }

  async findAll(): Promise<CurrencyRate[]> {
    const data = await this.getSheetData(TABS.CURRENCY_RATES);
    const headers = data[0] || [];
    const rates: CurrencyRate[] = [];

    for (let i = 1; i < data.length; i++) {
      const obj = this.rowToObject(headers, data[i]);
      if (obj.from_currency && obj.to_currency) {
        rates.push(this.parseCurrencyRate(obj));
      }
    }

    return rates;
  }

  private parseCurrencyRate(obj: Record<string, any>): CurrencyRate {
    return {
      from_currency: obj.from_currency,
      to_currency: obj.to_currency,
      rate: parseFloat(obj.rate) || 1,
      updated_at: obj.updated_at,
    };
  }
}
