// src/utils/emailGenerator.ts

export type IEmailTem = { subject: string; html: string };

export class EmailGenerator {
    generatePasswordResetEmail(token: string, user_name: string): IEmailTem {
      const subject = 'Reset Your Password';
      const html = `
        <p>Hi ${user_name},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `;
      return { subject, html };
    }
  
    generateAccountConfirmationEmail(token: string, user_name: string): IEmailTem {
      const subject = 'Confirm Your Account';
      const html = `
        <p>Hi ${user_name},</p>
        <p>Thank you for registering. Please confirm your account by clicking the link below:</p>
        <a href="${process.env.FRONTEND_URL}/confirm-account?token=${token}">Confirm Account</a>
        <p>If you didn't create this account, please ignore this email.</p>
      `;
      return { subject, html };
    }
  
    generateWelcomeEmail(user_name: string): IEmailTem {
      const subject = 'Welcome to Our Service!';
      const html = `
        <p>Hi ${user_name},</p>
        <p>Welcome to our service! We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
      `;
      return { subject, html };
    }
  }
  