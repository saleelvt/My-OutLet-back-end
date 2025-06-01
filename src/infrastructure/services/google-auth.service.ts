// import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
// import { User } from 'src/domain/entities/user.entity';
// import { IUserRepository } from 'src/domain/interfaces/IUserRepsitory';
// import { TokenService } from './token.service';

// @Injectable()
// export class GoogleAuthService {
//   constructor(
//     @Inject('IUserRepository') private readonly userRepository: IUserRepository,
//     private readonly tokenService: TokenService,
//   ) {}

//   async handleGoogleLogin(googleUser: any) {
//     // let user = await this.userRepository.findUserByEmail(googleUser.email);

//     // const accessToken = this.tokenService.generateAccessToken(user);
//     // const refreshToken = this.tokenService.generateRefreshToken(user);

//     // return {
//     //   user,
//     //   accessToken,
//     //   refreshToken,
//     // };
//   }
// }