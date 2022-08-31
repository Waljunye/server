import {Body, Controller, Get, Header, HttpStatus, Patch, Post, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {Response as Res} from "express";
import {Response} from "@nestjs/common";
import {Request} from "@nestjs/common";
import AuthGuard from "./guards/auth.guard";
import {ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {User} from "./models/user.model";
import {GenerateTokenDto} from "./dto/generate.token.dto";

@ApiTags('Auth.Api')
@Controller('api')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiSecurity('Oauth2', ['Oauth2'])
    @ApiOperation({ summary: "Returns all users (authorized only)" })
    @ApiResponse({ status: HttpStatus.OK, description: "Success", type: [User] })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
    @UseGuards(AuthGuard)
    @Get('users')
    getAll(){
        return this.authService.getAll();
    }
    @ApiOperation({ summary: "Login + refresh AccessToken and refreshToken" })
    @ApiResponse({ status: HttpStatus.OK, description: "Success", type: GenerateTokenDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request" })
    @Post('/auth/login')
    async login(@Response({ passthrough: true}) res,@Request() req, @Body()dto: CreateUserDto){
        const returnableValue = await this.authService.login(dto);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return returnableValue;
    }
    @ApiOperation({ summary: "Register + refresh AccessToken and refreshToken" })
    @ApiResponse({ status: HttpStatus.OK, description: "Success", type: GenerateTokenDto })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "FORBIDDEN" })
    @Post('/auth/register')
    async register(@Response({ passthrough: true }) res, @Request() req, @Body()dto: CreateUserDto){
        const returnableValue = await this.authService.register(dto);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return returnableValue;
    }
    @ApiOperation({ summary: "LogOut user(clear refreshToken in cookie)" })
    @ApiResponse({ status: HttpStatus.OK, description: "Success" })
    @Post('/auth/logout')
    async logOut(@Request() req, @Response({passthrough: true}) res){
        const refreshToken  = req.cookies.refreshToken;
        const token = await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.set(HttpStatus.OK)
        return token;
    }
    @ApiOperation({ summary: "Get new AccessToken, by refreshToken)" })
    @ApiResponse({ status: HttpStatus.OK, description: "Success", type: GenerateTokenDto })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "UNAUTHORIZED" })
    @UseGuards(AuthGuard)
    @Post('/auth/refresh')
    async refresh(@Request() req, @Response({passthrough: true}) res){
        const refreshToken  = req.cookies.refreshToken;
        const returnableValue = await this.authService.refresh(refreshToken);
        res.set(HttpStatus.OK);
        res.cookie('refreshToken', returnableValue.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return returnableValue;
    }
}
