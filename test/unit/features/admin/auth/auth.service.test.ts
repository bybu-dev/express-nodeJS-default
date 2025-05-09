import { Models } from '@/models';
import { Repositories } from '@/repositories';
import AuthService from '@/features/api/admin/auth/auth.service';
import { ISignIn, ISignUp } from '@/features/api/admin/auth/auth.types';
import { ErrorResponseProps } from '@/utils/types/types';

// Mock admin
const mockAdmin = {
  id: 'admin123',
  name: 'John',
  email_address: 'john@example.com',
  password: 'hashedPassword',
};

describe('AuthService', () => {
  const mockEncryption = {
    comparePassword: jest.fn(),
    encryptPassword: jest.fn(),
    encryptToken: jest.fn().mockReturnValue('fake-token'),
  };

  const mockModels = {
    admin: {
      findOne: jest.fn(),
    },
    user: {
      findOne: jest.fn(),
      save: jest.fn(),
    },
  } as unknown as Models;

  const mockRepositories = {
    encryption: mockEncryption,
  } as unknown as Repositories;

  const service = new AuthService(mockRepositories, mockModels);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const request: ISignIn = {
      email_address: 'john@example.com',
      password: 'password123',
    };

    it('should return error if admin not found', async () => {
      mockModels.admin.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.login(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result.error?.[0].message).toBe('invalid credentials');
    });

    it('should return error if password is invalid', async () => {
      mockModels.admin.findOne = jest.fn().mockResolvedValue(mockAdmin);
      mockEncryption.comparePassword = jest.fn().mockReturnValue(false);

      const result = await service.login(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result.error?.[0].message).toBe('invalid credentials');
    });

    it('should return tokens on valid login', async () => {
      mockModels.admin.findOne = jest.fn().mockResolvedValue(mockAdmin);
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
      name: 'Jane',
      email_address: 'jane@example.com',
      password: 'pass123',
    };

    const mockUser = {
      id: 'user123',
      name: 'Jane',
      email_address: 'jane@example.com',
      personal: { first_name: 'Jane' },
      password: 'hashedPassword',
      setting: { is_banned: false },
    };

    it('should return error if user already exists', async () => {
      mockModels.user.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.register(request) as ErrorResponseProps;

      expect(result.status).toBe(false);
      expect(result.error?.[0].message).toBe('user exist already');
    });

    it('should create user and return tokens', async () => {
      mockModels.user.findOne = jest.fn().mockResolvedValue(null);
      mockEncryption.encryptPassword = jest.fn().mockReturnValue('hashedPassword');
      mockModels.user.save = jest.fn().mockResolvedValue(mockUser);

      const result = await service.register(request);

      expect(mockModels.user.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane',
          email_address: 'jane@example.com',
        })
      );

      expect(result.status).toBe(true);
      if (!result.status) return;
      expect(result.data?.access_token).toBe('fake-token');
      expect(result.data?.refresh_token).toBe('fake-token');
    });
  });
});
