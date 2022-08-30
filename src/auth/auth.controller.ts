import {Body, Controller, Get, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('users')
    getAll(): Promise<any> {
        return this.authService.getAll();
    }

    @Post('/login')
    login(@Body()dto: CreateUserDto){
        return this.authService.login(dto);
    }
    @Post('/register')
    register(@Body()dto: CreateUserDto){
        return this.authService.register(dto);
    }
}
