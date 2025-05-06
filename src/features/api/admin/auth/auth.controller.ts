import { Request, Response } from 'express'
import AuthService, { ISignIn, ISignUp } from './auth.service';

class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request & { body: ISignIn }, res: Response) => {
        const response = await this.authService.register(req.body);
        if (!response.status) return res.status(400).json(response);
        res.json(response);
    }
    
    login = async (req: Request & { body: ISignUp }, res: Response) => {
        const response = await this.authService.login(req.body);
        if (!response.status) return res.status(400).json(response);
        res.json(response);
    }
}

export default AuthController;