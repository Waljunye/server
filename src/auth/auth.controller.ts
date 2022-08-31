import {Body, Controller, Get, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {Response as Res} from "express";
import {Response} from "@nestjs/common";

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
    async register(@Response({ passthrough: true }) res, @Body()dto: CreateUserDto){
        const returnableValue = await this.authService.register(dto);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return returnableValue;
    }
}
