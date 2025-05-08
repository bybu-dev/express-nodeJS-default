import { Models } from "@/models";
import { ISecureUser } from "@/models/user";
import { IAuthUser, IResponse } from "@/utils/types/types";
import { IUpdateUser } from "./profile.type";

class ProfileService {
  constructor(private readonly models: Models) {}

  getProfile = async (auth: IAuthUser): Promise<IResponse<ISecureUser>> => {
    try {
      const user = await this.models.user.findOne({ where: { id: auth.id },});
      if (!user) return { status: false, message: "Unable to get user" };

      return { status: true, data: user.toResponse };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { status: false, message: "Unable to get user" };
    }
  };

  updateProfile = async (auth: IAuthUser, request: IUpdateUser): Promise<IResponse<ISecureUser>> => {
    try {
      const user = await this.models.user.findOne({ where: { id: auth.id } });
      if (!user) return { status: false, message: "Unable to update user" };

      user.personal.first_name = request.first_name;
      user.personal.surname = request.surname;

      const updatedUser = await this.models.user.save(user);

      return { status: true, data: updatedUser.toResponse };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { status: false, message: "Unable to update user" };
    }
  };
}

export default ProfileService;
