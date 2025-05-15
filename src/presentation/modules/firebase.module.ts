import { HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { PhoneVerificationService } from 'src/infrastructure/services/phoneVerification.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const serviceAccount = {
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          privateKey: configService
            .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        };

        if (
          !serviceAccount.clientEmail ||
          !serviceAccount.privateKey ||
          !serviceAccount.projectId
        ) {
          throw new HttpExceptionError(
            MESSAGES.FIREBASE_CONFIG_MISSING,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        return admin;
      },
      inject: [ConfigService],
    },
    PhoneVerificationService,
  ],
  exports: ['FIREBASE_ADMIN', PhoneVerificationService],
})
export class FirebaseModule {}
