import { Router } from "express";
import { UserRole } from "@/middleware/roles/user.role";
import { IData } from "@/utils/types/types";
import ProfileController from "./profile.controller";
import ProfileService from "./profile.service";

const profileRouter = (data: IData): Router => {
    const router = Router();
    const profileController = new ProfileController(new ProfileService(data.model));

    router.get('/', UserRole(data), profileController.getProfile);
    router.put('/', UserRole(data), profileController.updateProfile);
    return router
}

export default profileRouter;