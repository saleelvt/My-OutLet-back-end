import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { JwtPayload } from 'src/common/interfaces/jwt.payload.interface';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.getId(),
      phone: user.getPhone(),
      role: user.getRole().getValue(),
      type: 'access',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
    });
  }

  generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.getId(),
      phone: user.getPhone(),
      role: user.getRole().getValue(),
      type: 'refresh',
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
  }

  async verifyToken(
    token: string,
    type: 'access' | 'refresh' = 'access',
  ): Promise<JwtPayload> {
    try {
      if (!token) {
        throw new HttpExceptionError(
          MESSAGES.TOKEN_MISSING,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const secret = this.configService.get<string>(
        type === 'access' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET',
      );

      if (!secret) {
        throw new HttpExceptionError(
          MESSAGES.TOKEN_INVALID,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      if (!payload) {
        throw new HttpExceptionError(
          MESSAGES.TOKEN_INVALID,
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (payload.type !== type) {
        throw new HttpExceptionError(
          MESSAGES.TOKEN_TYPE_MISMATCH,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof HttpExceptionError) {
        throw error;
      }

      console.error('Token verification failed:', error);
      throw new HttpExceptionError(
        MESSAGES.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
