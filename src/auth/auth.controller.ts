import {Body, Controller, Get, Header, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {Response as Res} from "express";
import {Response} from "@nestjs/common";
import {Request} from "@nestjs/common";
import AuthGuard from "./guards/auth.guard";

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Get('users')
    getAll(){
        return this.authService.getAll();
    }

    @Post('/login')
    async login(@Response({ passthrough: true}) res,@Request() req, @Body()dto: CreateUserDto){
        const returnableValue = await this.authService.login(dto);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return returnableValue;
    }
    @Post('/register')
    async register(@Response({ passthrough: true }) res, @Request() req, @Body()dto: CreateUserDto){
        const returnableValue = await this.authService.register(dto);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return returnableValue;
    }
    @Post('/logout')
    async logOut(@Request() req, @Response({passthrough: true}) res){
        const refreshToken  = req.cookies.refreshToken;
        const token = await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.set(HttpStatus.OK)
        return token;
    }
    @Post('/refresh')
    async refresh(@Request() req, @Response({passthrough: true}) res){
        const refreshToken  = req.cookies.refreshToken;
        const returnableValue = await this.authService.refresh(refreshToken);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return returnableValue;
    }
}
