import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodogramJwtModule } from '@/jwt/jwt.module';
import {Todo} from "@/entities/todo.entity";
import {TodoService} from "@/todo/todo.service";
import {TodoController} from "@/todo/todo.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Todo]),
        TodogramJwtModule
    ],
    providers: [TodoService],
    controllers: [TodoController],
})
export class TodoModule {}