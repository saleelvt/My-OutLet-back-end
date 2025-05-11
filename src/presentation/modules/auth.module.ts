import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { SignupUseCase } from 'src/application/useCases/auth/signup.useCase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    PrismaService,
  ],
})
export class AuthModule {}
