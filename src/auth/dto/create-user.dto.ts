import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: "User email", nullable: false })
    username: string;
    @ApiProperty({ description: "User password", nullable: false })
    password: string;
}
