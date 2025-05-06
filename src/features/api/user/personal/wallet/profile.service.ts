import { IUser, UserModel } from "../../../../../shared/data/models/user";
import { IAuthUser, IResponse } from "../../../../../shared/utils/types/types";

export type IUpdateUser = {
    first_name: string;
    second_name: string;
}

const ProfileService = {
    getWallet: async (auth: IAuthUser): Promise<IResponse<IUser>> => {
        try {
            const user = await UserModel.findById(auth.id);
            if (!user) return { status: false, error: [{ message: "unable to get user" }]}
                
            return { status: true, data: user };
        } catch (error) {
            return { status: false, error: [{ message: "unable to get user" }]}
        }
    },
    updateWallet: async (auth: IAuthUser, request: IUpdateUser): IResponse<IUser> => {
        try {
            const updateUser = await UserModel.findByIdAndUpdate(auth.id, {
                first_name: request.first_name,
                second_name: request.second_name,
            })
            if (!updateUser) return { status: false, error: [{ message: "unable to update user" }]}
                
            return { status: true, data: updateUser };
        } catch (error) {
            return { status: false, error: [{ message: "unable to update user" }]}
        }
    }
}

export default ProfileService;