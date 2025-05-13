import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SignupDto } from 'src/application/dtos/signup.dto';
import { SignupUseCase } from 'src/application/useCases/auth/signup.useCase';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } =
      await this.signupUseCase.execute({
        phone: dto.phone,
        name: dto.name,
      });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    });

    return res.json({
      user: {
        id: user.getId(),
        phone: user.getPhone(),
        name: user.getName(),
        role: user.getRole().getValue(),
        created_at: user.getCreatedAt(),
      },
    });
  }

  @Get('profile')
  getProfil(@Req() req: Request) {
    if (!req.user) {
      throw new HttpExceptionError(
        MESSAGES.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log(req.user, 'userrrrr');
    return { user: req.user };
  }
}
