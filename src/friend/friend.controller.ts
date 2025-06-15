import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "@/jwt/jwt.guard";
import {CurrentUser} from "@/decorator/current-user.decorator";
import {FriendService} from "@/friend/friend.service";
import {CreateFriendRequest} from "@/dto/friend.dto";

@Controller('/friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    getFriends(@CurrentUser() user: { id: string }) {
        return this.friendService.getFriends(user.id);
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    addFriend(@Body() request: CreateFriendRequest){
        return this.friendService.addFriend(request.userId, request.userId);
    }

    @Delete(':friendId')
    @UseGuards(JwtAuthGuard)
    deleteFriend(@Param('friendId') friendId: string) {
        return this.friendService.deleteFriend(friendId);
    }
}
