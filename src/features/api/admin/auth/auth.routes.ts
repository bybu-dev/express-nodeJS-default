import { Router } from "express";
import AuthController from "./auth.controller";
import { validateLogin, validateRegister } from "./auth.types";
import AuthService from "./auth.service";
import { IData } from "@/utils/types/types";

const authRouter = (data: IData) => {
    const router = Router();
    const authController = new AuthController(new AuthService(data.repo, data.model));

    router.post('/register', validateRegister, authController.register);
    router.post('/login', validateLogin, authController.login);

    return router
}
export default authRouter;