import { Module } from '@nestjs/common';
import { AuthModule } from './presentation/modules/auth.module';
import { FirebaseModule } from './presentation/modules/firebase.module';

@Module({
  imports: [AuthModule, FirebaseModule],
})
export class AppModule {}
