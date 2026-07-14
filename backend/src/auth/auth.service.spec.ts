import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('registers a user and returns an access token', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      usersServiceMock.create.mockResolvedValue({
        id: 1,
        email: 'ahcmad@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Ahcmad',
        lastName: 'Angagao',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jwtServiceMock.signAsync.mockResolvedValue('generated-access-token');

      const result = await authService.register({
        email: 'AHCMAD@example.com',
        firstName: 'Ahcmad',
        lastName: 'Angagao',
        password: 'Password123!',
      });

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
        'ahcmad@example.com',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 12);

      expect(usersServiceMock.create).toHaveBeenCalledWith({
        email: 'ahcmad@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Ahcmad',
        lastName: 'Angagao',
      });

      expect(result).toEqual({
        accessToken: 'generated-access-token',
        user: {
          id: 1,
          email: 'ahcmad@example.com',
          firstName: 'Ahcmad',
          lastName: 'Angagao',
        },
      });
    });

    it('throws when the email is already registered', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ahcmad@example.com',
      });

      await expect(
        authService.register({
          email: 'ahcmad@example.com',
          firstName: 'Ahcmad',
          lastName: 'Angagao',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(usersServiceMock.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('logs in a user with valid credentials', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ahcmad@example.com',
        passwordHash: 'stored-password-hash',
        firstName: 'Ahcmad',
        lastName: 'Angagao',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtServiceMock.signAsync.mockResolvedValue('generated-access-token');

      const result = await authService.login({
        email: 'ahcmad@example.com',
        password: 'Password123!',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password123!',
        'stored-password-hash',
      );

      expect(result.accessToken).toBe('generated-access-token');

      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejects an unknown email', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'missing@example.com',
          password: 'Password123!',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an incorrect password', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ahcmad@example.com',
        passwordHash: 'stored-password-hash',
        firstName: 'Ahcmad',
        lastName: 'Angagao',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'ahcmad@example.com',
          password: 'WrongPassword123!',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
