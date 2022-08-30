import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./auth/models/user.model";

@Injectable()
export class AppService {
  constructor(@InjectModel(User) private userRepo: typeof User) {
  }
  getHello(): string {
    return 'Hello World!';
  }
  async getAllUsers(){
    return this.userRepo.findAll()
  }
}
