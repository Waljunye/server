import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
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
            return this.generateToken(user);
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
        console.log('passed')
        await this.saveToken(new UserDto(payload), refreshToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
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
        }catch (e){

        }
    }
    async logout(){

    }
    async refresh(){}
    async activate(){}
    async getAll(){
        return this.userRepo.findAll();
    }

}
