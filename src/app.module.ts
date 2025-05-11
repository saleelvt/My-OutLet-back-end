import { Module } from '@nestjs/common';
import { AuthModule } from './presentation/modules/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
