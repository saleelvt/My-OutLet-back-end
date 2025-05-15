import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { SignupUseCase } from 'src/application/useCases/auth/signup.useCase';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from 'src/infrastructure/services/token.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
    }),
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    PrismaService,
    TokenService,
    AuthMiddleware,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/signup/init', method: RequestMethod.POST },
        { path: 'auth/signup/verify', method: RequestMethod.POST },
      )
      .forRoutes(AuthController);
  }
}
