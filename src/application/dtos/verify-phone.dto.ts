import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

export class VerifyPhoneDto {
  @IsString()
  @IsNotEmpty({ message: MESSAGES.FIREBASE_TOKEN_REQUIRED })
  idToken: string;

  @IsUUID()
  @IsNotEmpty({ message: MESSAGES.TEMP_USER_ID_REQUIRED })
  tempUserId: string;
}
