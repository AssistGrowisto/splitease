import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '@/lib/config';
import { userRepo } from '@/lib/repositories';
import type { User, JwtPayload } from '@/types';

/**
 * AuthService - Handles authentication operations
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    // Check if user already exists
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create new user
    const user = await userRepo.create({
      email,
      password_hash: passwordHash,
      display_name: email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
    });

    // Generate JWT token
    const token = this.generateToken(user);

    // Return token and user (without password_hash)
    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password_hash'> }> {
    // Find user by email
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isValidPassword = await bcryptjs.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new Error('User account is suspended');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Return token and user (without password_hash)
    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Handle forgot password flow
   */
  async forgotPassword(email: string): Promise<string> {
    // Find user by email
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate temporary password
    const tempPassword = this.generateTempPassword();

    // Hash and update password
    const passwordHash = await bcryptjs.hash(tempPassword, 10);
    await userRepo.update(user.user_id, {
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    });

    // Return temporary password (caller will send email)
    return tempPassword;
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Find user
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcryptjs.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);

    // Update user
    await userRepo.update(userId, {
      password_hash: newPasswordHash,
      updated_at: new Date().toISOString(),
    });
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(user: User): string {
    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      user_id: user.user_id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    } as any);
  }

  /**
   * Generate a random temporary password meeting all password criteria
   * Must be: min 8 chars, at least one uppercase, lowercase, digit, and special char
   */
  private generateTempPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{};\':"|,.<>/?';

    // Ensure at least one of each required character type
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest randomly
    const allChars = uppercase + lowercase + digits + specialChars;
    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Generate unique ID with prefix
   */
  private generateId(prefix: string): string {
    const { nanoid } = require('nanoid');
    return `${prefix}_${nanoid(12)}`;
  }
}

// Export singleton instance
export const authService = new AuthService();
