import {Controller, Post, Body, Get, UseGuards, Req, Query, Put} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "@/dto/user.dto";
import {JwtAuthGuard} from "@/jwt/jwt.guard";
import {CurrentUser} from "@/decorator/current-user.decorator";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    register(
        @Body() request: CreateUserDto,
    ) {
        return this.userService.register(request.userId, request.password, request.username, request.authCode);
    }

    @Post('login')
    login(@Body() request: {userId: string, password: string}) {
        return this.userService.login(request.userId, request.password);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: { userId: string }) {
        return this.userService.getUserByUserId(user.userId);
    }

    @Get('detail')
    getUserDetail(@Query('userId') userId: string) {
        return this.userService.getUserByUserId(userId);
    }

    @Post('password')
    @UseGuards(JwtAuthGuard)
    checkPassword(@CurrentUser() user: { userId: string },
                  @Body() request: {password: string}) {
        return this.userService.checkPassword(user.userId, request.password);
    }

    @Put('password')
    @UseGuards(JwtAuthGuard)
    updatePassword(@CurrentUser() user: { userId: string },
                  @Body() request: { password: string }) {
        return this.userService.updateUserPassword(user.userId, request.password);
    }

    @Put('username')
    @UseGuards(JwtAuthGuard)
    updateUsername(@CurrentUser() user: { userId: string },
                   @Body() request: { username: string }) {
        return this.userService.updateUsername(user.userId, request.username);
    }
}