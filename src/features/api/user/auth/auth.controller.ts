import { Request, Response } from 'express';
import AuthService from './auth.service';
import { ISignIn, ISignUp } from './auth.types';
import { IResponse } from '@/utils/types/types';

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request<{}, any, ISignUp>,  res: Response ): Promise<void> => {
    const result = await this.authService.register(req.body);
    res.status(result.status ? 200 : 400).json(result);
  };

  login = async (req: Request<{}, any, ISignIn>, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);
    res.status(result.status ? 200 : 400).json(result);
  };
}
