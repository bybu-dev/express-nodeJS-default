import { Router } from "express";
import { getApiRequests } from "@/utils/lib/logger";
import { IData } from "@/utils/types/types";
import { NewSocketConnector } from "@/utils/lib/socket";
import adminRouter from "./api/admin/admin.route";
import userRouter from "./api/user/user.routes";

const router = (data: IData) => {
    const router = {
        router: Router(),
        socket: NewSocketConnector(data.repo.encryption)
    }

    router.router.use(getApiRequests());
    router.router.use('/api/admin', adminRouter(data));
    router.router.use('/api/user', userRouter(data));

    return router;
}

export default router;