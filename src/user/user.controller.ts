import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@/dto/user.dto";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    register(
        @Body() request: CreateUserDto,
    ) {
        return this.userService.register(request.userId, request.password, request.username, request.authCode);
    }

    @Post('/login')
    login(@Body() request: {userId: string, password: string}) {
        return this.userService.login(request.userId, request.password);
    }
}