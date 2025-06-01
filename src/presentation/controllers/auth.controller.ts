import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SignupDto } from 'src/application/dtos/signup.dto';
import { SignupUseCase } from 'src/application/useCases/auth/signup.useCase';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { VerifyPhoneDto } from 'src/application/dtos/verify-phone.dto';
// import { GoogleAuthService } from 'src/infrastructure/services/google-auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly signupUseCase: SignupUseCase,
    // private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('signup/init')
  @HttpCode(HttpStatus.OK)
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    const { tempUserId } = await this.signupUseCase.initiateSignup({
      phone: dto.phone,
      name: dto.name,
    });

    return res.json({
      success: true,
      message: 'Signup initiated. Please verify your phone number.',
      tempUserId,
    });
  }

  @Post('signup/verify')
  @HttpCode(HttpStatus.CREATED)
  async verifyAndCompleteSignup(
    @Body() dto: VerifyPhoneDto,
    @Res() res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.signupUseCase.completeSignup(dto);

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
        isVerified: user.getIsVerified(),
      },
    });
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {
  // }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
  //   // const { user, accessToken, refreshToken } = await this.googleAuthService.handleGoogleLogin(req.user);

  //   const cookieOptions = {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict' as const,
  //   };
  //   // res.cookie('access_token', accessToken, {
  //   //   ...cookieOptions,
  //   //   maxAge: 30 * 24 * 60 * 60 * 1000,
  //   // });
  //   // res.cookie('refresh_token', refreshToken, {
  //   //   ...cookieOptions,
  //   //   maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  //   // });
  //   return res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');`);
  // }

  @Get('profile')
  getProfile(@Req() req: Request) {
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
