import { IAdminModel, AdminModel } from "./admin";
import { IUserModel, UserModel } from "./user";


export class Models {
    static new = async () => {
        return new Models(
            AdminModel,
            UserModel,
        )
    }
    constructor(
        readonly admin: IAdminModel,
        readonly user: IUserModel,
    ) {}
}