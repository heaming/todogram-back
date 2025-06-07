import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "@/jwt/jwt.guard";
import type {TodoCreateRequest, TodoUpdateRequest} from "@/dto/todo.dto";
import {TodoService} from "@/todo/todo.service";
import {CurrentUser} from "@/decorator/current-user.decorator";

@Controller('/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get('all/user/:userId')
    @UseGuards(JwtAuthGuard)
    getTodos(@Param('userId') userId: string,
             @Query('categoryId') categoryId: string,
             @Query('date') date: string) {
        return this.todoService.getTodos(userId, categoryId, date);
    }

    @Get('count/:userId')
    @UseGuards(JwtAuthGuard)
    getTodosCount(@Param('userId') userId: string,
                  @Query('date') date: string) {
        return this.todoService.getTodosCount(userId, date);
    }

    @Get('detail/:todoId')
    @UseGuards(JwtAuthGuard)
    getTodoById(@Param('todoId') todoId: string) {
        return this.todoService.getTodoById(todoId);
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    addTodo(@Body() request: TodoCreateRequest) {
        return this.todoService.addTodo(request);
    }

    @Put(':todoId')
    @UseGuards(JwtAuthGuard)
    updateTodo(@Param('todoId') todoId: string,
               @Body() request: TodoUpdateRequest) {
        return this.todoService.updateTodo(todoId, request);
    }

    @Delete('category/:categoryId/todos')
    @UseGuards(JwtAuthGuard)
    deleteTodosByCategoryId(@CurrentUser() user: { id: string },
                            @Param('categoryId') categoryId: string) {
        return this.todoService.deleteTodoByCategoryId(user.id, categoryId);
    }

    @Delete(':todoId')
    @UseGuards(JwtAuthGuard)
    deleteTodo(@CurrentUser() user: { id: string },
               @Param('todoId') todoId: string) {
        return this.todoService.deleteTodo(user.id, todoId);
    }

    @Get('done-dates/:selectedYM/user/:userId')
    @UseGuards(JwtAuthGuard)
    getDoneDates(@Param('userId') userId: string,
                 @Param('selectedYM') selectedYM: string) {
        return this.todoService.getDoneDates(userId, selectedYM);
    }
}