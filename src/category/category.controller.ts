import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {CategoryService} from "@/category/category.service";
import {JwtAuthGuard} from "@/jwt/jwt.guard";
import type {CategoryCreateRequest, CategoryUpdateRequest} from "@/dto/category.dto";
import {CurrentUser} from "@/decorator/current-user.decorator";
import {Public} from "@/decorator/public.decorator";

@Controller('/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {
    }

    @Get('detail/:categoryId')
    @UseGuards(JwtAuthGuard)
    getCategory(@Param('categoryId') categoryId: string) {
        return this.categoryService.getCategory(categoryId)
    }

    @Get('all/user/:userId')
    @UseGuards(JwtAuthGuard)
    getCategories(@Param('userId') userId: string) {
        return this.categoryService.getCategories(userId);
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    addCategory(@Body() request: CategoryCreateRequest){
        return this.categoryService.addCategory(request);
    }

    @Put(':categoryId')
    @UseGuards(JwtAuthGuard)
    updateCategory(@Param('categoryId') categoryId: string,
                   @Body() request: CategoryUpdateRequest) {
        return this.categoryService.updateCategory(categoryId, request);
    }

    @Delete(':categoryId')
    @UseGuards(JwtAuthGuard)
    deleteCategory(@CurrentUser() user: { id: string },
                   @Param('categoryId') categoryId: string) {
        return this.categoryService.deleteCategory(user.id, categoryId);
    }

    @Public()
    @Post('public')
    createInitialCategory(@Body() request: CategoryCreateRequest) {
        return this.categoryService.addCategory(request);
    }
}
