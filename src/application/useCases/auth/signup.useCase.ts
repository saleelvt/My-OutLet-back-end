import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from 'src/domain/interfaces/IUserRepsitory';
import { SignupDto } from 'src/application/dtos/signup.dto';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { HttpStatus, Inject } from '@nestjs/common';
import { TokenService } from 'src/infrastructure/services/token.service';
import { PhoneVerificationService } from 'src/infrastructure/services/phoneVerification.service';
import { VerifyPhoneDto } from 'src/application/dtos/verify-phone.dto';

export class SignupUseCase {
  private tempUsers = new Map<string, { phone: string; name: string }>();
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  async initiateSignup(dto: SignupDto): Promise<{ tempUserId: string }> {
    const existingUser = await this.userRepository.findUserByPhone(dto.phone);
    if (existingUser) {
      throw new HttpExceptionError(
        MESSAGES.PHONE_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const tempUserId = uuidv4();
    this.tempUsers.set(tempUserId, { phone: dto.phone, name: dto.name });

    return { tempUserId };
  }

  async completeSignup(
    dto: VerifyPhoneDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const tempUserData = this.tempUsers.get(dto.tempUserId);
    if (!tempUserData) {
      throw new HttpExceptionError(
        MESSAGES.SIGNUP_SESSION_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { uid, phoneNumber } =
      await this.phoneVerificationService.verifyPhoneNumber(dto.idToken);

    if (phoneNumber !== tempUserData.phone) {
      throw new HttpExceptionError(
        MESSAGES.PHONE_VERIFICATION_MISMATCH,
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = uuidv4();

    const user = User.create(
      userId,
      tempUserData.phone,
      tempUserData.name,
      'CUSTOMER',
      uid,
      true,
    );

    if (!user.getRole().isCustomer()) {
      throw new HttpExceptionError(
        MESSAGES.INVALID_ROLE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const savedUser = await this.userRepository.createUser(user);

    this.tempUsers.delete(dto.tempUserId);

    const accessToken = this.tokenService.generateAccessToken(savedUser);
    const refreshToken = this.tokenService.generateRefreshToken(savedUser);

    return { user: savedUser, accessToken, refreshToken };
  }
}
