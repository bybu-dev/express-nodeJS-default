import { IUser, ISecureUser } from "@/models/user";
import { ErrorResponseProps, IAuthUser, IResponse } from "@/utils/types/types";
import { Models } from "@/models";
import ProfileService from "@/features/api/user/personal/profile/profile.service";

// Mocks
const mockUser: IUser = {
  _id: "123" as any,
  personal: {
    first_name: "John",
    surname: "Doe",
    email_address: "john@example.com",
  },
  password: "hashedpassword",
  wallet: { balance: 100 },
  setting: { is_banned: false },
  created_at: new Date(),
  updated_at: new Date(),
};

const mockSecureUser: ISecureUser = {
  id: "123",
  personal: mockUser.personal,
  setting: mockUser.setting,
  created_at: mockUser.created_at,
  updated_at: mockUser.updated_at,
};

const mockUserModel = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  toResponse: jest.fn().mockReturnValue(mockSecureUser),
};

const mockModels = {
  user: mockUserModel,
} as unknown as Models;

const profileService = new ProfileService(mockModels);

const mockAuth: IAuthUser = {
  id: "123",
  first_name: "",
  email_address: "",
  created_at: new Date()
};

// Tests
describe("ProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return user profile if found", async () => {
      mockUserModel.findById.mockResolvedValueOnce(mockUser);

      const result = await profileService.getProfile(mockAuth);

      console.log("result: ", result)

      expect(mockUserModel.findById).toHaveBeenCalledWith("123");
      expect(mockUserModel.toResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ status: true, data: mockSecureUser });
    });

    it("should return error if user not found", async () => {
      mockUserModel.findById.mockResolvedValueOnce(null);

      const result = await profileService.getProfile(mockAuth);

      expect(result.status).toBe(false);
      expect(result.message).toBe("unable to get user");
    });
  });

  describe("updateProfile", () => {
    it("should update and return updated user", async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValueOnce(mockUser);

      const request = { first_name: "Jane", surname: "Smith" };

      const result = await profileService.updateProfile(mockAuth, request);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",{
          "personal.first_name": request.first_name,
          "personal.surname": request.surname,
      }, { new: true });

      expect(mockUserModel.toResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ status: true, data: mockSecureUser });
    });

    it("should return error if user is not found", async () => {
      mockUserModel.findByIdAndUpdate.mockResolvedValueOnce(null);

      const result = await profileService.updateProfile(mockAuth, {
        first_name: "Test",
        surname: "Fail",
      }) as ErrorResponseProps;

      console.log("result: ", result);

      expect(result.status).toBe(false);
      expect(result.message).toBe("unable to update user");
    });
  });
});
