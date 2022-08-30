import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {JwtModule} from "@nestjs/jwt";
import {Token} from "./models/token.model";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
      SequelizeModule.forFeature([User, Token]),
      JwtModule.register({
          secret: process.env.SECRET_ACCESS_TOKEN || 'SECRET',

      })
  ],
    exports: [AuthService]
})
export class AuthModule {}
