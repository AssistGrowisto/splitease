import { z } from 'zod';

// Password validation: min 8 chars, at least one uppercase, lowercase, digit, and special char
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one digit')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

// Auth Schemas
export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Group Schemas
export const createGroupSchema = z.object({
  group_name: z.string().min(1, 'Group name is required').max(50, 'Group name must be 50 characters or less'),
  base_currency: z.string().min(1, 'Currency is required'),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export const addMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type AddMemberInput = z.infer<typeof addMemberSchema>;

// Expense Schemas
export const createExpenseSchema = z
  .object({
    description: z.string().min(1, 'Description is required').max(200, 'Description must be 200 characters or less'),
    total_amount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().min(1, 'Currency is required'),
    payers: z
      .array(
        z.object({
          user_id: z.string().min(1, 'User ID is required'),
          amount_paid: z.number().nonnegative('Amount paid must be non-negative'),
        })
      )
      .min(1, 'At least one payer is required'),
    splits: z
      .array(
        z.object({
          user_id: z.string().min(1, 'User ID is required'),
          split_amount: z.number().nonnegative('Split amount must be non-negative'),
          split_percentage: z.number().optional(),
        })
      )
      .min(1, 'At least one split is required'),
    split_type: z.enum(['equal', 'custom', 'percentage']),
    expense_date: z.string().datetime('Invalid date format'),
    receipt_data: z.string().optional(),
  })
  .refine(
    (data) => {
      const payerTotal = data.payers.reduce((sum, p) => sum + p.amount_paid, 0);
      return Math.abs(payerTotal - data.total_amount) < 0.01; // Account for floating point errors
    },
    {
      message: 'Total amount paid must equal total amount',
      path: ['payers'],
    }
  )
  .refine(
    (data) => {
      if (data.split_type === 'percentage') {
        const percentageTotal = data.splits.reduce((sum, s) => sum + (s.split_percentage || 0), 0);
        return Math.abs(percentageTotal - 100) < 0.01;
      }
      return true;
    },
    {
      message: 'Split percentages must sum to 100%',
      path: ['splits'],
    }
  );

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const updateExpenseSchema = z.object({
    description: z.string().min(1, 'Description is required').optional(),
    total_amount: z.number().positive('Total amount must be positive').optional(),
    currency: z.string().min(1, 'Currency is required').optional(),
    split_type: z.enum(['equal', 'custom', 'percentage']).optional(),
    expense_date: z.string().datetime('Invalid date format').optional(),
    payers: z.array(z.object({
      user_id: z.string().min(1, 'User ID is required'),
      amount_paid: z.number().nonnegative('Amount paid must be non-negative'),
    })).optional(),
    splits: z.array(z.object({
      user_id: z.string().min(1, 'User ID is required'),
      split_amount: z.number().nonnegative('Split amount must be non-negative').optional(),
      split_percentage: z.number().min(0).max(100).optional(),
    })).optional(),
  });

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

// Settlement Schema
export const settleSchema = z.object({
  to_user_id: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
});

export type SettleInput = z.infer<typeof settleSchema>;

// Display Name Schema
export const updateDisplayNameSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be 50 characters or less'),
});

export type UpdateDisplayNameInput = z.infer<typeof updateDisplayNameSchema>;

// Update Group Schema
export const updateGroupSchema = z.object({
  group_name: z.string().min(1, 'Group name is required').max(50, 'Group name must be 50 characters or less'),
});

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
