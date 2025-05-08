import { Router } from "express";
import { UserRole } from "@/middleware/roles/user.role";
import { IData } from "@/utils/types/types";
import ProfileController from "./profile.controller";
import ProfileService from "./profile.service";
import { validateBody } from "@/middleware/validate";
import { UpdateUserDTO } from "./profile.type";

const profileRouter = (data: IData): Router => {
    const router = Router();
    const profileController = new ProfileController(new ProfileService(data.model));

    router.get('/', UserRole(data), profileController.getProfile);
    router.put('/', UserRole(data), validateBody(UpdateUserDTO), profileController.updateProfile);
    return router
}

export default profileRouter;