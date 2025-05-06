import { Models } from "@/models";
import { ISecureUser } from "@/models/user";
import { IAuthUser, IResponse } from "@/utils/types/types";

export type IUpdateUser = {
    first_name: string;
    surname: string;
}

class ProfileService {
    constructor(
        private readonly models: Models
    ) {}

    getProfile = async (auth: IAuthUser): Promise<IResponse<ISecureUser>> => {
        try {
            const user = await this.models.user.findById(auth.id).populate(["setting.accounts"]);
            if (!user) return { status: false, message: "unable to get user" };
                
            return { status: true, data: this.models.user.toResponse(user) };
        } catch (error) {
            console.log("error: ", error);
            return { status: false, message: "unable to get user"}
        }
    }

    updateProfile = async (auth: IAuthUser, request: IUpdateUser): IResponse<ISecureUser> => {
        try {
            const updateUser = await this.models.user.findByIdAndUpdate(auth.id, {
                "personal.first_name": request.first_name,
                "personal.surname": request.surname,
            }, { new: true })
            if (!updateUser) return { status: false, message: "unable to update user"}
                
            return { status: true, data: this.models.user.toResponse(updateUser) };
        } catch (error) {
            return { status: false, message: "unable to update user" }
        }
    }
}

export default ProfileService;