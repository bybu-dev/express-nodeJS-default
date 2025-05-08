import { addHours, isAfter } from 'date-fns';
import { Repositories } from '@/repositories';
import { IResponse } from '@/utils/types/types';
import { Models } from '@/models';
import { ChangePasswordParams, ConfirmTokenParams, SendConfirmationParams } from './password.types';

export class PasswordService {
  constructor(
    private readonly model: Models,
    private readonly repo: Repositories
  ) {}

  // Step 1: Send Confirmation
  async sendConfirmation({ email_address }: SendConfirmationParams): Promise<IResponse<string>> {
    const user = await this.model.user.findOne({ where: { personal: { email_address } } });
    if (!user) return { status: true, data: 'If the email exists, a reset link has been sent.' };

    const token = this.repo.encryption.createToken();
    const tokenExpiry = addHours(new Date(), 2); // Token valid for 2 hours

    user.setting.peripheral.reset_password_token = token;
    user.setting.peripheral.reset_password_expires = tokenExpiry;
    await this.model.user.save(user);

    // Send email with the token
    const template = this.repo.notification.template.generatePasswordResetEmail(user.personal.first_name, token);
    await this.repo.notification.sendEmail(user.personal.email_address, template);

    return { status: true, data: 'If the email exists, a reset link has been sent.' };
  }

  async confirmToken({ token }: ConfirmTokenParams): Promise<IResponse<string>> {
    const user = await this.model.user.findOne({ where: { setting: { peripheral: { reset_password_token: token } } } });
    if (
      !user ||
      !user.setting.peripheral.reset_password_expires ||
      isAfter(new Date(), user.setting.peripheral.reset_password_expires)
    ) {
      return { status: false, message: 'Invalid or expired token.' };
    }

    return { status: true, data: 'Token is valid.' };
  }

  // Step 3: Change Password
  async changePassword({ token, new_password, confirm_password }: ChangePasswordParams): Promise<IResponse<string>> {
    if (new_password !== confirm_password) {
      return { status: false, message: 'Passwords do not match.' };
    }

    const user = await this.model.user.findOne({ where: { setting: { peripheral: { reset_password_token: token } } } });
    if (
      !user ||
      !user.setting.peripheral.reset_password_expires ||
      isAfter(new Date(), user.setting.peripheral.reset_password_expires)
    ) {
      return { status: false, message: 'Invalid or expired token.' };
    }

    user.password = this.repo.encryption.encryptPassword(new_password);
    user.setting.peripheral.reset_password_token = undefined;
    user.setting.peripheral.reset_password_expires = undefined;
    await this.model.user.save(user);

    return { status: true, data: 'Password has been reset successfully.' };
  }
}
