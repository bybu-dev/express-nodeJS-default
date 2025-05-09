import { IUser, ISecureUser } from "@/models/user";
import { IAuthUser } from "@/utils/types/types";
import { Models } from "@/models";
import ProfileService from "@/features/api/user/personal/profile/profile.service";

// Mocks
const mockUser: IUser = {
  id: "123" as any,
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

const mockUserEntity = {
  ...mockUser,
  toResponse: mockSecureUser,
}

// mocks/user.repository.ts
export const mockUserModel = {
  findOne: jest.fn(),
  save: jest.fn(),
  // Add other methods as needed
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
      mockUserModel.findOne.mockResolvedValueOnce(mockUserEntity);
  
      const result = await profileService.getProfile(mockAuth);
  
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      jest.spyOn(mockUserEntity, 'toResponse', 'get').mockReturnValue(mockSecureUser);
      expect(result).toEqual({ status: true, data: mockSecureUser });
    });
  
    it("should return error if user not found", async () => {
      mockUserModel.findOne.mockResolvedValueOnce(null);
  
      const result = await profileService.getProfile(mockAuth);
  
      expect(result.status).toBe(false);
      expect(result.message).toBe("unable to get user");
    });
  });

  describe("updateProfile", () => {
    it("should update and return updated user", async () => {
      const request = { first_name: "Jane", surname: "Smith" };
  
      // Mock the user entity
      const mockUserEntity2 = mockUserEntity;
      mockUserEntity2.personal.first_name = request.first_name
      mockUserEntity2.personal.surname = request.surname

      const mockUserResult = mockSecureUser;
      mockUserResult.personal.first_name = request.first_name
      mockUserResult.personal.surname = request.surname
  
      // Mock the repository methods
      mockUserModel.findOne.mockResolvedValue(mockUserEntity);
      mockUserModel.save.mockResolvedValue(mockUserEntity2);
  
      // Mock the toResponse getter
      // jest.spyOn(mockUserEntity2, 'toResponse', 'get').mockReturnValue(mockUserResult);
  
      const result = await profileService.updateProfile(mockAuth, request);
  
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(mockUserEntity.personal.first_name).toBe(request.first_name);
      expect(mockUserEntity.personal.surname).toBe(request.surname);
      expect(mockUserModel.save).toHaveBeenCalledWith(mockUserEntity);
      expect(result).toEqual({ status: true, data: mockUserResult });
    });
  
    it("should return error if user is not found", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
  
      const result = await profileService.updateProfile(mockAuth, {
        first_name: "Test",
        surname: "Fail",
      });
  
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { id: "123" } });
      expect(result.status).toBe(false);
      expect(result.message).toBe("unable to update user");
    });
  });
  
});
