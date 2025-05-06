import { Router } from "express";
import { IData } from "@/utils/types/types";
import authRouter from "./auth/auth.routes";

const adminRouter = (data: IData): Router => {
    const router = Router();

    router.use('/auth', authRouter(data));

    return router;
}

export default adminRouter;