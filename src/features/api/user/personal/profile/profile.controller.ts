import { Request, Response } from 'express'
import ProfileService from './profile.service';
import { IUpdateUser } from './profile.type';

class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    getProfile = async (req: Request, res: Response) => {
        const response = await this.profileService.getProfile(req.user);
        res.json(response);
    }

    updateProfile = async (req: Request<{}, any, IUpdateUser>, res: Response) => {
        const response = await this.profileService.updateProfile(req.user, req.body);
        res.json(response);
    }
}

export default ProfileController;