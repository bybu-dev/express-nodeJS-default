import { Router } from "express";
import { IData } from "@/utils/types/types";
import profileRouter from "./profile/profile.routes";

const personalRouter = (data: IData): Router => {
    const router = Router();

    router.use('/profile', profileRouter(data));
    return router;
}

export default personalRouter;