import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { TodogramJwtModule } from '@/jwt/jwt.module';
import {UserService} from "@/user/user.service";
import {UserController} from "@/user/user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User]), TodogramJwtModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
