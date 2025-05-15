import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class PhoneVerificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  async verifyPhoneNumber(idToken: string): Promise<{
    uid: string;
    phoneNumber: string;
  }> {
    try {
      const decodedToken = await this.firebaseAdmin
        .auth()
        .verifyIdToken(idToken);

      if (!decodedToken.phone_number) {
        throw new HttpExceptionError(
          MESSAGES.PHONE_NOT_VERIFIED,
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        uid: decodedToken.uid,
        phoneNumber: decodedToken.phone_number,
      };
    } catch (error) {
      console.error('Error verifying phone number:', error);
      throw new HttpExceptionError(
        MESSAGES.INVALID_VERIFICATION,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
