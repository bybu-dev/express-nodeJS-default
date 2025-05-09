import { Router } from "express";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { IData } from "@/utils/types/types";
import { SignInDTO, SignUpDTO } from "./auth.types";
import { validateBody } from "@/middleware/validate";

const authRouter = (data: IData) => {
    const router = Router();
    const authController = new AuthController(new AuthService(data.repo, data.model));

    router.post('/register', validateBody(SignUpDTO), authController.register);
    router.post('/login', validateBody(SignInDTO), authController.login);

    return router
}
export default authRouter;