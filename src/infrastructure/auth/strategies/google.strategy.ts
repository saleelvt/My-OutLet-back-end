// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private readonly configService: ConfigService) {
//     super({
//       clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
//       clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
//       callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
//       scope: ['email', 'profile'],
//     });
//     if (
//       !configService.get<string>('GOOGLE_CLIENT_ID') ||
//       !configService.get<string>('GOOGLE_CLIENT_SECRET') ||
//       !configService.get<string>('GOOGLE_CALLBACK_URL')
//     ) {
//       throw new Error('Google OAuth environment variables are not set');
//     }
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: Profile,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
//     const user = {
//       email: emails?.[0]?.value ?? '',
//       firstName: name?.givenName ?? '',
//       lastName: name?.familyName ?? '',
//       picture: photos?.[0]?.value ?? '',
//       accessToken,
//     };
//     done(null, user);
//   }
// }