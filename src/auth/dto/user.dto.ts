import {User} from "../models/user.model";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto{
    @ApiProperty({ description: "User Email", nullable: false })
    username: string;
    @ApiProperty({ description: "User Id", nullable: false})
    id: number;
    constructor(model : User) {
        this.username = model.username;
        this.id = model.userId;
    }
}
