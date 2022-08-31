import {UserDto} from "./user.dto";
import {ApiProperty} from "@nestjs/swagger";

export class GenerateTokenDto {
    @ApiProperty({ description: "Access Token", nullable: false })
    accessToken:string;
    @ApiProperty({ description: "Refresh Token", nullable: false })
    refreshToken: string;
    @ApiProperty({ description: "User Data Transfer Object", nullable: false })
    userDto: UserDto;

    constructor(accessToken, refreshToken, userDto: UserDto) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userDto = userDto;
    }
}
