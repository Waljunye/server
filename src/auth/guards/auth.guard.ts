import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import * as jwt from 'jsonwebtoken';
import {AuthService} from "../auth.service";

@Injectable()
export default class AuthGuard implements CanActivate{
    constructor(private reflector: Reflector,
                private authService : AuthService) {}


    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = String(req.headers.authorization);
        const bearer = authHeader.split(" ")[0];
        const token = authHeader.split(' ')[1];
        if(bearer !== 'Bearer' || !token ){
            throw new UnauthorizedException();
        }

        const userData = this.authService.validateAccessToken(token);
        if(!userData){
            throw new UnauthorizedException();
        }else{
            return true;
        }
    }
}
