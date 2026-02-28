import nodemailer from 'nodemailer';
import { config } from '@/lib/config';
import type { Group, Expense, User, SimplifiedDebt } from '@/types';

/**
 * EmailService - Handles all email communications
 * All methods are fire-and-forget (errors are logged but not thrown)
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  /**
   * Send email notification when expense is added
   */
  async sendExpenseAdded(group: Group, expense: Expense, recipients: string[]): Promise<void> {
    try {
      const subject = `New expense in ${group.group_name}`;
      const html = this.getExpenseAddedTemplate(group, expense);

      await this.sendEmail({
        to: recipients.join(','),
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send expense added email:', error);
    }
  }

  /**
   * Send email notification when expense is edited
   */
  async sendExpenseEdited(group: Group, expense: Expense, recipients: string[]): Promise<void> {
    try {
      const subject = `Expense updated in ${group.group_name}`;
      const html = this.getExpenseEditedTemplate(group, expense);

      await this.sendEmail({
        to: recipients.join(','),
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send expense edited email:', error);
    }
  }

  /**
   * Send email notification when expense is deleted
   */
  async sendExpenseDeleted(group: Group, expense: Expense, recipients: string[]): Promise<void> {
    try {
      const subject = `Expense deleted in ${group.group_name}`;
      const html = this.getExpenseDeletedTemplate(group, expense);

      await this.sendEmail({
        to: recipients.join(','),
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send expense deleted email:', error);
    }
  }

  /**
   * Send email notification when settlement is recorded
   */
  async sendSettlementRecorded(group: Group, fromUser: User, toUser: User, amount: number): Promise<void> {
    try {
      const subject = `Settlement recorded in ${group.group_name}`;
      const html = this.getSettlementTemplate(group, fromUser, toUser, amount);

      await this.sendEmail({
        to: [fromUser.email, toUser.email].join(','),
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send settlement email:', error);
    }
  }

  /**
   * Send email notification when user is added to group
   */
  async sendAddedToGroup(group: Group, userEmail: string): Promise<void> {
    try {
      const subject = `You've been added to ${group.group_name}`;
      const html = this.getAddedToGroupTemplate(group, userEmail);

      await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send added to group email:', error);
    }
  }

  /**
   * Send email notification when user is removed from group
   */
  async sendRemovedFromGroup(group: Group, userEmail: string): Promise<void> {
    try {
      const subject = `You've been removed from ${group.group_name}`;
      const html = this.getRemovedFromGroupTemplate(group, userEmail);

      await this.sendEmail({
        to: userEmail,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send removed from group email:', error);
    }
  }

  /**
   * Send email with temporary password for forgot password flow
   */
  async sendForgotPassword(email: string, tempPassword: string): Promise<void> {
    try {
      const subject = 'Your temporary password for SplitEase';
      const html = this.getForgotPasswordTemplate(email, tempPassword);

      await this.sendEmail({
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Failed to send forgot password email:', error);
    }
  }

  /**
   * Internal method to send email
   */
  private async sendEmail(options: { to: string; subject: string; html: string }): Promise<void> {
    await this.transporter.sendMail({
      from: config.smtp.user,
      ...options,
    });
  }

  /**
   * HTML template for expense added notification
   */
  private getExpenseAddedTemplate(group: Group, expense: Expense): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>New Expense Added</h2>
          <p>A new expense has been added in <strong>${group.group_name}</strong>:</p>
          <p><strong>${expense.description}</strong></p>
          <p>Amount: <strong>${expense.total_amount} ${expense.currency}</strong></p>
          <p>Date: ${new Date(expense.expense_date).toLocaleDateString()}</p>
          <p><a href="${config.app.url}/groups/${group.group_id}" style="color: #1A73E8; text-decoration: none;">View in SplitEase</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for expense edited notification
   */
  private getExpenseEditedTemplate(group: Group, expense: Expense): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Expense Updated</h2>
          <p>An expense has been updated in <strong>${group.group_name}</strong>:</p>
          <p><strong>${expense.description}</strong></p>
          <p>Amount: <strong>${expense.total_amount} ${expense.currency}</strong></p>
          <p>Date: ${new Date(expense.expense_date).toLocaleDateString()}</p>
          <p><a href="${config.app.url}/groups/${group.group_id}" style="color: #1A73E8; text-decoration: none;">View in SplitEase</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for expense deleted notification
   */
  private getExpenseDeletedTemplate(group: Group, expense: Expense): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Expense Deleted</h2>
          <p>An expense has been deleted in <strong>${group.group_name}</strong>:</p>
          <p><strong>${expense.description}</strong></p>
          <p>Amount: <strong>${expense.total_amount} ${expense.currency}</strong></p>
          <p><a href="${config.app.url}/groups/${group.group_id}" style="color: #1A73E8; text-decoration: none;">View in SplitEase</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for settlement notification
   */
  private getSettlementTemplate(group: Group, fromUser: User, toUser: User, amount: number): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Settlement Recorded</h2>
          <p>A settlement has been recorded in <strong>${group.group_name}</strong>:</p>
          <p><strong>${fromUser.display_name}</strong> paid <strong>${toUser.display_name}</strong></p>
          <p>Amount: <strong>${amount}</strong></p>
          <p><a href="${config.app.url}/groups/${group.group_id}" style="color: #1A73E8; text-decoration: none;">View in SplitEase</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for added to group notification
   */
  private getAddedToGroupTemplate(group: Group, userEmail: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Added to Group</h2>
          <p>You've been added to the group <strong>${group.group_name}</strong>!</p>
          <p>You can now view and add expenses to this group.</p>
          <p><a href="${config.app.url}/groups/${group.group_id}" style="color: #1A73E8; text-decoration: none;">View Group</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for removed from group notification
   */
  private getRemovedFromGroupTemplate(group: Group, userEmail: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Removed from Group</h2>
          <p>You've been removed from the group <strong>${group.group_name}</strong>.</p>
          <p>You will no longer have access to this group's expenses.</p>
          <p><a href="${config.app.url}" style="color: #1A73E8; text-decoration: none;">Back to SplitEase</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }

  /**
   * HTML template for forgot password notification
   */
  private getForgotPasswordTemplate(email: string, tempPassword: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1A73E8; color: white; padding: 20px; text-align: center;">
          <h1>SplitEase</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Here's your temporary password:</p>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 14px;">
            <strong>${tempPassword}</strong>
          </p>
          <p>Please use this password to log in and change your password immediately.</p>
          <p><a href="${config.app.url}/login" style="color: #1A73E8; text-decoration: none;">Log In</a></p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>SplitEase - Split expenses with friends</p>
        </div>
      </div>
    `;
  }
}

// Export singleton instance
export const emailService = new EmailService();
