import AuthController from '@/features/api/user/auth/auth.controller';
import AuthService from '@/features/api/user/auth/auth.service';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    } as unknown as AuthService;

    authController = new AuthController(authService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('register', () => {
    it('should return 200 and response on successful registration', async () => {
      const mockRequest = {
        body: { email_address: 'test@example.com', password: '1234' },
      } as Request;

      const result = { status: true, data: { token: 'abc123' } };
      (authService.register as jest.Mock).mockResolvedValue(result);

      await authController.register(mockRequest, mockResponse as Response);

      expect(authService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should return 400 on failed registration', async () => {
      const mockRequest = {
        body: { email_address: 'bad@example.com', password: '1234' },
      } as Request;

      const result = { status: false, error: [{ message: 'Invalid' }] };
      (authService.register as jest.Mock).mockResolvedValue(result);

      await authController.register(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });

  describe('login', () => {
    it('should return 200 and response on successful login', async () => {
      const mockRequest = {
        body: { first_name: 'John', second_name: 'Doe', email_address: 'john@example.com', password: 'pass' },
      } as Request;

      const result = { status: true, data: { token: 'jwt-token' } };
      (authService.login as jest.Mock).mockResolvedValue(result);

      await authController.login(mockRequest, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).not.toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });

    it('should return 400 on failed login', async () => {
      const mockRequest = {
        body: { first_name: 'John', second_name: 'Doe', email_address: 'john@example.com', password: 'wrong' },
      } as Request;

      const result = { status: false, error: [{ message: 'Unauthorized' }] };
      (authService.login as jest.Mock).mockResolvedValue(result);

      await authController.login(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(result);
    });
  });
});
