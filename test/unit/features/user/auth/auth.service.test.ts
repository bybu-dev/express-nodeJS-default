import { Models } from '@/models';
import { Repositories } from '@/repositories';
import { UserModel } from '@/models/user';
import AuthService from '@/features/api/user/auth/auth.service';
import { ISignIn, ISignUp } from '@/features/api/user/auth/auth.types';

// Mock user
import { IUser } from '@/models/user';
import { ErrorResponseProps, IAuthResponse, SuccessResponseProps } from '@/utils/types/types';

const mockUser: Partial<IUser> = {
  id: 'user123',
  personal: {
    first_name: 'John',
    surname: 'Doe',
    email_address: 'john@example.com',
  },
  password: 'hashedPassword',
  setting: {
    is_banned: false,
  },
};

describe('AuthService', () => {
  const mockEncryption = {
    comparePassword: jest.fn(),
    encryptPassword: jest.fn(),
    encryptToken: jest.fn().mockReturnValue('fake-token'),
  };

  const mockRepositories = {
    encryption: mockEncryption,
  } as unknown as Repositories;

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockModels = {
    user: mockUserRepo,
  } as unknown as Models;

  const service = new AuthService(mockRepositories, mockModels);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const request: ISignIn = {
      email_address: 'john@example.com',
      password: 'password123',
    };

    it('should return error if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const result = await service.login(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result.error?.[0]?.message).toBe('invalid credentials');
    });

    it('should return error if password is invalid', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockEncryption.comparePassword = jest.fn().mockReturnValue(false);

      const result = await service.login(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result?.error?.[0]?.field).toBe('password');
      expect(result?.error?.[0]?.message).toBe('invalid credentials');
    });

    it('should return tokens on valid login', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockEncryption.comparePassword = jest.fn().mockReturnValue(true);

      const result = await service.login(request);

      expect(result.status).toBe(true);
      if (!result.status) return;
      expect(result.data?.access_token).toBe('fake-token');
      expect(result.data?.refresh_token).toBe('fake-token');
    });
  });

  describe('register', () => {
    const request: ISignUp = {
      first_name: 'Jane',
      second_name: 'Doe',
      email_address: 'jane@example.com',
      password: 'pass123',
    };

    it('should return error if user already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      const result = await service.register(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result?.error?.[0]?.message).toBe('user exist already');
    });

    it('should create user and return tokens', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockEncryption.encryptPassword = jest.fn().mockReturnValue('hashedPassword');
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.register(request);

      // expect(mockUserRepo.save).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     personal: expect.objectContaining({
      //       first_name: request.first_name,
      //       surname: request.second_name,
      //       email_address: 'jane@example.com',
      //     }),
      //   })
      // );

      expect(result.status).toBe(true);
      if (!result.status) return;
      expect(result.data?.access_token).toBe('fake-token');
      expect(result.data?.refresh_token).toBe('fake-token');
    });
  });
});
