import { Request, Response } from "express";
import { ISecureUser } from "@/models/user";
import ProfileService from "@/features/api/user/personal/profile/profile.service";
import ProfileController from "@/features/api/user/personal/profile/profile.controller";
import { IResponse } from "@/utils/types/types";

describe("ProfileController", () => {
  let mockProfileService: jest.Mocked<ProfileService>;
  let controller: ProfileController;
  let mockRes: Partial<Response>;
  let jsonSpy: jest.Mock;

  const mockUser = { id: "user123" };
  const mockSecureUser: ISecureUser = {
    id: "user123",
    personal: {
      first_name: "John",
      surname: "Doe",
      email_address: "john@example.com",
    },
    setting: {
      is_banned: false,
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    mockProfileService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    } as unknown as jest.Mocked<ProfileService>;

    controller = new ProfileController(mockProfileService);

    jsonSpy = jest.fn();
    mockRes = {
      json: jsonSpy,
    };
  });

  describe("getProfile", () => {
    it("should call service and respond with profile", async () => {
      const req = {
        user: mockUser,
      } as Request;

      mockProfileService.getProfile.mockResolvedValueOnce({
          status: true,
          data: mockSecureUser,
      } as unknown as IResponse<ISecureUser>);

      await controller.getProfile(req, mockRes as Response);

      expect(mockProfileService.getProfile).toHaveBeenCalledWith(mockUser);
      expect(jsonSpy).toHaveBeenCalledWith({
        status: true,
        data: mockSecureUser,
      });
    });
  });

  describe("updateProfile", () => {
    it("should call service and respond with updated profile", async () => {
      const req = {
        user: mockUser,
        body: {
          first_name: "Jane",
          surname: "Smith",
        },
      } as Request;

      mockProfileService.updateProfile.mockResolvedValueOnce({
        status: true,
        data: {
          ...mockSecureUser,
          personal: {
            ...mockSecureUser.personal,
            first_name: "Jane",
            surname: "Smith",
          },
        },
      });

      await controller.updateProfile(req, mockRes as Response);

      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(mockUser, {
        first_name: "Jane",
        surname: "Smith",
      });

      expect(jsonSpy).toHaveBeenCalledWith({
        status: true,
        data: {
          ...mockSecureUser,
          personal: {
            ...mockSecureUser.personal,
            first_name: "Jane",
            surname: "Smith",
          },
        },
      });
    });
  });
});
