import { Models } from '@/models';
import { Repositories } from '@/repositories';
import { UserModel } from '@/models/user';
import AuthService from '@/features/api/user/auth/auth.service';
import { ISignIn, ISignUp } from '@/features/api/user/auth/auth.types';

// Mock user
const mockUser = {
  id: 'user123',
  personal: {
    first_name: 'John',
    surname: 'Doe',
    email_address: 'john@example.com',
  },
  password: 'hashedPassword',
  setting: {
    subscription: {
      package: 'Pro',
      status: 'active',
      start_date: new Date(),
      end_date: new Date(),
    },
  },
};

jest.mock('@/models/user', () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('AuthService', () => {
  const mockEncryption = {
    comparePassword: jest.fn(),
    encryptPassword: jest.fn(),
    encryptToken: jest.fn().mockReturnValue('fake-token'),
  };

  const mockRepositories = {
    encryption: mockEncryption,
  } as unknown as Repositories;

  const mockModels = {
    user: {
      findOne: jest.fn(),
    },
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
      mockModels.user.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.login(request);

      expect(result.status).toBe(false);
      expect(result.message).toBe('invalid credentials');
    });

    it('should return error if password is invalid', async () => {
      mockModels.user.findOne = jest.fn().mockResolvedValue(mockUser);
      mockEncryption.comparePassword = jest.fn().mockReturnValue(false);

      const result = await service.login(request);

      expect(result.status).toBe(false);
      expect(result.message).toBe('invalid credentials');
    });

    it('should return tokens on valid login', async () => {
      mockModels.user.findOne = jest.fn().mockResolvedValue(mockUser);
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
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register(request);

      expect(result.status).toBe(false);
      expect(result.message).toBe('user exist already');
    });

    it('should create user and return tokens', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      mockEncryption.encryptPassword = jest.fn().mockReturnValue('hashedPassword');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register(request);

      expect(UserModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          personal: expect.objectContaining({
            first_name: 'Jane',
            surname: 'Doe',
            email_address: 'jane@example.com',
          }),
        })
      );

      expect(result.status).toBe(true);
      if (!result.status) return;
      expect(result.data?.access_token).toBe('fake-token');
      expect(result.data?.refresh_token).toBe('fake-token');
    });
  });
});
