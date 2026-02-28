import { nanoid } from 'nanoid';

/**
 * Format a number as currency string
 * @param amount - The amount to format
 * @param currencyCode - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(amount);
}

/**
 * Generate unique ID with prefix using nanoid
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string): string {
  return `${prefix}_${nanoid(12)}`;
}

/**
 * Parse a string value to boolean
 * @param value - String value to parse
 * @returns Boolean value
 */
export function parseBoolean(value: string): boolean {
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
}

/**
 * Get current datetime as ISO string
 * @returns ISO format datetime string
 */
export function toISOString(): string {
  return new Date().toISOString();
}

/**
 * Calculate equal split amounts with fair rounding
 * Handles rounding by giving extra penny to the first person (alphabetically)
 * @param total - Total amount to split
 * @param count - Number of people to split between
 * @returns Array of split amounts
 */
export function calculateEqualSplit(total: number, count: number): number[] {
  if (count <= 0) {
    return [];
  }

  const splitAmount = total / count;
  const baseAmount = Math.floor(splitAmount * 100) / 100; // Two decimal places
  const remainder = total - baseAmount * count;

  // Create array with base amounts
  const splits = Array(count).fill(baseAmount);

  // Distribute remainder starting from first person
  let remainingCents = Math.round(remainder * 100);
  for (let i = 0; i < count && remainingCents > 0; i++) {
    const increment = Math.min(0.01, remainingCents / 100);
    splits[i] += increment;
    remainingCents -= Math.round(increment * 100);
  }

  return splits.map((amount) => Math.round(amount * 100) / 100);
}

/**
 * Calculate percentage-based split amounts
 * @param total - Total amount to split
 * @param percentages - Array of percentages for each person
 * @returns Array of split amounts
 */
export function calculatePercentageSplit(total: number, percentages: number[]): number[] {
  if (percentages.length === 0) {
    return [];
  }

  // Verify percentages sum to 100
  const percentageSum = percentages.reduce((sum, p) => sum + p, 0);
  if (Math.abs(percentageSum - 100) > 0.01) {
    throw new Error('Percentages must sum to 100');
  }

  const splits = percentages.map((percentage) => (total * percentage) / 100);

  // Round to two decimal places and handle rounding errors
  const roundedSplits = splits.map((amount) => Math.round(amount * 100) / 100);
  
  // Calculate and distribute any rounding remainder
  const calculatedTotal = roundedSplits.reduce((sum, amount) => sum + amount, 0);
  const roundingError = total - calculatedTotal;

  if (Math.abs(roundingError) > 0.001) {
    roundedSplits[0] += roundingError;
  }

  return roundedSplits.map((amount) => Math.round(amount * 100) / 100);
}

/**
 * Simplify debts using the greedy algorithm
 * Reduces the number of transactions needed to settle all debts
 * @param balances - Object with user_id -> net balance (positive = creditor, negative = debtor)
 * @returns Array of transactions { from_user_id, to_user_id, amount }
 */
export function simplifyDebts(balances: Record<string, number>): Array<{ from_user_id: string; to_user_id: string; amount: number }> {
  const transactions: Array<{ from_user_id: string; to_user_id: string; amount: number }> = [];
  
  // Create array of [userId, balance] and filter zeros
  const balanceArray = Object.entries(balances)
    .filter(([_, balance]) => Math.abs(balance) > 0.01)
    .map(([userId, balance]) => [userId, balance]);

  if (balanceArray.length === 0) {
    return transactions;
  }

  // Separate creditors and debtors
  const creditors = balanceArray
    .filter(([_, balance]) => (balance as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number)); // Descending
  
  const debtors = balanceArray
    .filter(([_, balance]) => (balance as number) < 0)
    .sort((a, b) => (a[1] as number) - (b[1] as number)); // Ascending (most negative first)

  let creditorIdx = 0;
  let debtorIdx = 0;

  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const [creditorId, creditorBalance] = creditors[creditorIdx];
    const [debtorId, debtorBalance] = debtors[debtorIdx];

    const amount = Math.min(
      creditorBalance as number,
      Math.abs(debtorBalance as number)
    );

    // Record transaction
    transactions.push({
      from_user_id: debtorId as string,
      to_user_id: creditorId as string,
      amount: Math.round(amount * 100) / 100,
    });

    // Update balances
    creditors[creditorIdx][1] = (creditors[creditorIdx][1] as number) - amount;
    debtors[debtorIdx][1] = (debtors[debtorIdx][1] as number) + amount;

    // Move to next if balance is zero
    if (Math.abs(creditors[creditorIdx][1] as number) < 0.01) {
      creditorIdx++;
    }
    if (Math.abs(debtors[debtorIdx][1] as number) < 0.01) {
      debtorIdx++;
    }
  }

  return transactions;
}
