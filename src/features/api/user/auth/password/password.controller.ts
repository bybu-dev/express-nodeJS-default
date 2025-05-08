import { Request, Response } from 'express';
import { PasswordService } from './password.service';
import { ChangePasswordParams, ConfirmTokenParams, SendConfirmationParams } from './password.types';

export default class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // Step 1: Send Confirmation
  sendConfirmation = async (req: Request<{}, any, SendConfirmationParams>, res: Response): Promise<void> => {
    const { email_address } = req.body;
    const result = await this.passwordService.sendConfirmation({ email_address });
    res.status(result.status ? 200 : 400).json(result);
  };

  // Step 2: Confirm Token
  confirmToken = async (req: Request<ConfirmTokenParams>, res: Response): Promise<void> => {
    const { token } = req.params;
    const result = await this.passwordService.confirmToken({ token });
    res.status(result.status ? 200 : 400).json(result);
  };

  // Step 3: Change Password
  changePassword = async (req: Request<{}, any, ChangePasswordParams>, res: Response ): Promise<void> => {
    const { token, new_password, confirm_password } = req.body;
    const result = await this.passwordService.changePassword({ token, new_password, confirm_password });
    res.status(result.status ? 200 : 400).json(result);
  };
}
