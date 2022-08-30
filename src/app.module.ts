import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./auth/models/user.model";
import { AuthModule } from './auth/auth.module';
import {AuthController} from "./auth/auth.controller";
import {Token} from "./auth/models/token.model";

@Module({
  imports: [
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin',
        database: 'postgres',
        models: [User, Token],
        autoLoadModels: true,
      }),
      SequelizeModule.forFeature([User, Token]),
      AuthModule
  ]
  ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
