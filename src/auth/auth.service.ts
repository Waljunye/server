import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./models/user.model";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {Token} from "./models/token.model";
import {UserDto} from "./dto/user.dto";
@Injectable()
export class AuthService {
    constructor(@InjectModel(User) private userRepo: typeof User,
                @InjectModel(Token) private tokenRepo: typeof Token,
                private readonly jwtService: JwtService) {}
    async register(dto: CreateUserDto){
        try{
            const email = String(dto.email);
            const candidate = await this.userRepo.findOne({where: {email}})
            if(candidate){
                throw new HttpException('Exist', HttpStatus.BAD_REQUEST)
            }
            const hashedPassword = await bcrypt.hash(dto.password, 3);
            const user = await this.userRepo.create({...dto, password: hashedPassword});
            return await this.generateToken(user);
        }catch (e){
            return e
        }

    }
    private async generateToken(payload){
        const accessToken = jwt.sign(
            {payload},
            process.env.SECRET_ACCESS_TOKEN,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRE})
        const refreshToken = jwt.sign(
            {payload},
            process.env.SECRET_REFRESH_TOKEN,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRE}
        )
        await this.saveToken(new UserDto(payload), refreshToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userDto: new UserDto(payload)
        }
    }
    private async saveToken(userDTO : UserDto, refreshToken){
        const email = userDTO.email;
        const user = await this.userRepo.findOne({where: {email}})
        const tokenData = await this.tokenRepo.findOne({where: {userId: user.userId}})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }
        const userId = userDTO.id;
        return await this.tokenRepo.create({userId, refreshToken});
    }

    async login(dto: CreateUserDto){
        try{
            const user = await this.userRepo.findOne({where : { email: dto.email}})
            if(!user) {
                throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
            }
            const isPasswordCompare = await bcrypt.compare(dto.password, user.password);
            if(!isPasswordCompare) {
                throw new HttpException('invalid password', HttpStatus.BAD_REQUEST)
            }
            return await this.generateToken(user)
        }catch (e){
            return e
        }
    }
    async logout(refreshToken: string){
        const token = await this.tokenRepo.destroy({where: {refreshToken : refreshToken}})
        return {
            message: 'user Log out'
        }
    }
    async refresh(refreshToken){
        if(!refreshToken){
            throw new UnauthorizedException()
        }
        const userData = await this.validateRefreshToken(refreshToken);
        const _refreshToken = await this.tokenRepo.findOne({where: {refreshToken: refreshToken}});
        if(!userData || !_refreshToken){
            throw new UnauthorizedException()
        }
        const userId = _refreshToken.userId;
        const user = await this.userRepo.findOne({where: {userId : userId}})
        return await this.generateToken(user);
    }
    private async validateRefreshToken(refreshToken){
        try{
            return await jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
        }catch (e){
            return null;
        }
    }
     validateAccessToken(accessToken){
        try{
            return jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        }catch (e){
            return null;
        }
    }
    async getAll(){
        return this.userRepo.findAll();
    }

}
