import { Request, Response } from 'express'
import ProfileService from './profile.service';
import { IUpdateUser } from './profile.type';
import { ResponseProps } from '@/utils/types/types';
import { ISecureUser } from '@/models/user';

class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    getProfile = async (req: Request, res: Response) => {
        const response = await this.profileService.getProfile(req.user);
        res.status(response.status ? 200 : 400).json(response);
    }

    updateProfile = async (req: Request<{}, any, IUpdateUser>, res: Response<ResponseProps<ISecureUser>>) => {
        const response = await this.profileService.updateProfile(req.user, req.body);
        res.status(response.status ? 200 : 400).json(response);
    }

    updateProfileImage = async (req: Request<{}, any, IUpdateUser>, res: Response<ResponseProps<ISecureUser>>) => {
        const response = await this.profileService.updateProfileImage(req.user, { image: req.file?.filename });
        res.status(response.status ? 200 : 400).json(response);
    }
}

export default ProfileController;