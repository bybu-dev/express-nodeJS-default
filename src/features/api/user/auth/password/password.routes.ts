import { Router } from 'express';
import PasswordController from './password.controller';
import { PasswordService } from './password.service';
import { IData } from '@/utils/types/types';
import { validateBody } from '@/middleware/validate';
import { SendConfirmationDTO, ConfirmTokenDTO, ChangePasswordDTO } from './password.types';

const passwordRouter = (data: IData) => {
  const router = Router();
  const passwordController = new PasswordController(new PasswordService(data.model, data.repo));

  router.post('/send-confirmation', validateBody(SendConfirmationDTO), passwordController.sendConfirmation);
  router.post('/confirm-token', validateBody(ConfirmTokenDTO), passwordController.confirmToken);
  router.post('/change-password', validateBody(ChangePasswordDTO), passwordController.changePassword);

  return router;
};

export default passwordRouter;