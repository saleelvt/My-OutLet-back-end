import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from 'src/domain/interfaces/IUserRepsitory';
import { SignupDto } from 'src/application/dtos/signup.dto';
import { HttpExceptionError } from 'src/common/errors/httpExceptionError';
import { MESSAGES } from 'src/common/constants/messages.constant';
import { HttpStatus, Inject } from '@nestjs/common';
import { TokenService } from 'src/infrastructure/services/token.service';

export class SignupUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    dto: SignupDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // check if phone number is allready exist
    const existingUser = await this.userRepository.findUserByPhone(dto.phone);
    if (existingUser) {
      throw new HttpExceptionError(
        MESSAGES.PHONE_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }
    const user = User.create(uuidv4(), dto.phone, dto.name, 'CUSTOMER');
    if (!user.getRole().isCustomer()) {
      throw new HttpExceptionError(
        MESSAGES.INVALID_ROLE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const savedUser = await this.userRepository.createUser(user);

    const accessToken = this.tokenService.generateAccessToken(savedUser);
    const refreshToken = this.tokenService.generateRefreshToken(savedUser);

    return { user: savedUser, accessToken, refreshToken };
  }
}
