import { Router } from "express";
import { IData } from "@/utils/types/types";
import authRouter from "./auth/auth.routes";
import personalRouter from "./personal/personal.routes";

const userRouter = (data: IData): Router => {
    const router = Router();

    router.use('/auth', authRouter(data));
    router.use('/personal', personalRouter(data));

    return router;
}

export default userRouter;