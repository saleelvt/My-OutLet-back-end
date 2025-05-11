import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

export class SignupDto {
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: MESSAGES.INVALID_PHONE })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.NAME_REQUIRED })
  name: string;
}
