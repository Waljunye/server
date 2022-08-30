import {Controller, Get, Redirect} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api/auth/')
  redirect(){
    return {url: "/api/auth/users"}
  }
}
