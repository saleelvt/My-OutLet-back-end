import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignupDto } from 'src/application/dtos/signup.dto';
import { SignupUseCase } from 'src/application/useCases/auth/signup.useCase';

@Controller('auth')
export class AuthController {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto) {
    const user = await this.signupUseCase.execute({
      phone: dto.phone,
      name: dto.name,
    });
    return {
      id: user.getId(),
      phone: user.getPhone(),
      name: user.getName(),
      role: user.getRole().getValue(),
      created_at: user.getCreatedAt(),
    };
  }
}
