import {User} from "../models/user.model";

export class UserDto{
    email: string;
    id: number;
    constructor(model : User) {
        this.email = model.email;
        this.id = model.userId;
    }
}
