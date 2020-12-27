import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { AuthController } from './auth.controller';
import { CustomRepositoryProvider } from '../core/extended-repository';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    CustomRepositoryProvider(User),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
