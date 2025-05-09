import { Router } from "express";
import ProfileController from "./profile.controller";
import ProfileService from "./profile.service";
import { UpdateUserDTO } from "./profile.type";
import { IData } from "@/utils/types/types";
import { validateBody } from "@/middleware/validate";
import { UserRole } from "@/middleware/roles/user.role";
import { universalUpload } from "@/middleware/files";

const profileRouter = (data: IData): Router => {
    const router = Router();
    const profileController = new ProfileController(new ProfileService(data.model));

    router.get('/', UserRole(data), profileController.getProfile);
    router.put('/', UserRole(data), validateBody(UpdateUserDTO), profileController.updateProfile);
    router.put('/image', UserRole(data), universalUpload(data.repo.file), profileController.updateProfile);

    return router
}

export default profileRouter;