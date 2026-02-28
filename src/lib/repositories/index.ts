import { config } from '@/lib/config';
import {
  GoogleSheetsUserRepo,
  GoogleSheetsGroupRepo,
  GoogleSheetsGroupMemberRepo,
  GoogleSheetsExpenseRepo,
  GoogleSheetsExpensePayerRepo,
  GoogleSheetsExpenseSplitRepo,
  GoogleSheetsActivityLogRepo,
  GoogleSheetsCurrencyRateRepo,
} from './google-sheets';
import type {
  IUserRepository,
  IGroupRepository,
  IGroupMemberRepository,
  IExpenseRepository,
  IExpensePayerRepository,
  IExpenseSplitRepository,
  IActivityLogRepository,
  ICurrencyRateRepository,
} from './interfaces';

/**
 * Factory function to get the appropriate repository based on DATA_BACKEND
 */
function createRepositories() {
  if (config.dataBackend === 'google-sheets') {
    return {
      userRepo: new GoogleSheetsUserRepo(),
      groupRepo: new GoogleSheetsGroupRepo(),
      groupMemberRepo: new GoogleSheetsGroupMemberRepo(),
      expenseRepo: new GoogleSheetsExpenseRepo(),
      expensePayerRepo: new GoogleSheetsExpensePayerRepo(),
      expenseSplitRepo: new GoogleSheetsExpenseSplitRepo(),
      activityLogRepo: new GoogleSheetsActivityLogRepo(),
      currencyRateRepo: new GoogleSheetsCurrencyRateRepo(),
    };
  }

  // Default to Google Sheets if no other backend is specified
  return {
    userRepo: new GoogleSheetsUserRepo(),
    groupRepo: new GoogleSheetsGroupRepo(),
    groupMemberRepo: new GoogleSheetsGroupMemberRepo(),
    expenseRepo: new GoogleSheetsExpenseRepo(),
    expensePayerRepo: new GoogleSheetsExpensePayerRepo(),
    expenseSplitRepo: new GoogleSheetsExpenseSplitRepo(),
    activityLogRepo: new GoogleSheetsActivityLogRepo(),
    currencyRateRepo: new GoogleSheetsCurrencyRateRepo(),
  };
}

const repositories = createRepositories();

export const userRepo: IUserRepository = repositories.userRepo;
export const groupRepo: IGroupRepository = repositories.groupRepo;
export const groupMemberRepo: IGroupMemberRepository = repositories.groupMemberRepo;
export const expenseRepo: IExpenseRepository = repositories.expenseRepo;
export const expensePayerRepo: IExpensePayerRepository = repositories.expensePayerRepo;
export const expenseSplitRepo: IExpenseSplitRepository = repositories.expenseSplitRepo;
export const activityLogRepo: IActivityLogRepository = repositories.activityLogRepo;
export const currencyRateRepo: ICurrencyRateRepository = repositories.currencyRateRepo;

// Re-export interfaces for convenience
export type {
  IUserRepository,
  IGroupRepository,
  IGroupMemberRepository,
  IExpenseRepository,
  IExpensePayerRepository,
  IExpenseSplitRepository,
  IActivityLogRepository,
  ICurrencyRateRepository,
};
