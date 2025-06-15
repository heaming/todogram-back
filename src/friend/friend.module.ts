import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import {Friend} from "@/entities/friend.entity";
import {FriendService} from "@/friend/friend.service";
import {FriendController} from "@/friend/friend.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Friend, User])],
    providers: [FriendService],
    controllers: [FriendController],
})
export class FriendModule {}
