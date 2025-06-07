import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodogramJwtModule } from '@/jwt/jwt.module';
import {Category} from "@/entities/category.entity";
import {CategoryController} from "@/category/category.controller";
import {CategoryService} from "@/category/category.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        TodogramJwtModule
    ],
    providers: [CategoryService],
    controllers: [CategoryController],
})
export class CategoryModule {}