import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../infrastructure/services/token.service';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { JwtPayload } from 'src/common/interfaces/jwt.payload.interface';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  cookies: {
    access_token?: string;
    refresh_token?: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    console.log('⭐️ Auth Middleware Triggered');

    console.log('🍪 Cookies:', req.cookies);
    if (!req.cookies) {
      throw new HttpExceptionError(
        MESSAGES.COOKIES_UNAWAILABLE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (accessToken) {
      try {
        const payload: JwtPayload = await this.tokenService.verifyToken(
          accessToken,
          'access',
        );
        console.log('✅ Access token valid! User:', payload.sub);
        req.user = payload;
        return next();
      } catch (error) {
        console.error('❌ Access token verification failed:', error);
      }
    }

    if (!refreshToken) {
      console.error('❌ No refresh token available');
      throw new HttpExceptionError(
        MESSAGES.TOKEN_MISSING,
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload: JwtPayload = await this.tokenService.verifyToken(
        refreshToken,
        'refresh',
      );
      console.log('✅ Refresh token valid! User:', payload.sub);

      const newAccessToken = this.tokenService.generateAccessToken({
        getId: () => payload.sub,
        getPhone: () => payload.phone,
        getRole: () => ({ getValue: () => payload.role }),
      } as any);

      const newRefreshToken = this.tokenService.generateRefreshToken({
        getId: () => payload.sub,
        getPhone: () => payload.phone,
        getRole: () => ({ getValue: () => payload.role }),
      } as any);

      console.log(payload, 'payload for refresh token');

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
      };

      res.cookie('access_token', newAccessToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refresh_token', newRefreshToken, {
        ...cookieOptions,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
      });

      console.log('✅ New tokens issued and set in cookies');

      req.user = payload;
      return next();
    } catch (error) {
      if (error instanceof HttpExceptionError) {
        throw error;
      }
      throw new HttpExceptionError(
        MESSAGES.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
