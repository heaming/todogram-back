import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Todo} from "@/entities/todo.entity";
import {Repository} from "typeorm";
import {TodoCreateRequest, TodoUpdateRequest, UpdateType} from "@/dto/todo.dto";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) {}

    async getTodos(userId: string, categoryId: string, date: string) {
        try {
            return await this.todoRepository.find({
                where: {
                    userId: userId,
                    categoryId: categoryId,
                    date: date,
                },
                order: {sort: "ASC"},
                withDeleted: false,
            });
        } catch (err) {
            console.error('Failed to get todos', err);
            return [];
        }
    }

    async getTodosCount(userId: string, date: string) {
        try {
            const rows = await this.todoRepository.query(`
                WITH all_todos AS (SELECT date, COUNT (*) AS total_count
                                    FROM todo
                                    WHERE date = ?
                                      AND user_id = ?
                                    GROUP BY date),
                    done_todos AS (SELECT date, COUNT (*) AS done_count
                                    FROM todo
                                    WHERE date = ?
                                    AND (status = 1 OR status = true)
                                    AND user_id = ?
                                    GROUP BY date)
                SELECT a.total_count,
                       COALESCE(d.done_count, 0) AS done_count
                FROM all_todos a
                LEFT JOIN done_todos d ON a.date = d.date
            `, [date, userId, date, userId]);

            if (rows.length > 0) {
                const {total_count, done_count} = rows[0] as { total_count: number; done_count: number };
                return {total_count, done_count};
            }

            return {total_count: 0, done_count: 0}; // 해당 날짜에 할 일이 없는 경우
        } catch (err) {
            console.error('Failed to count todos', err);
            return {total_count: 0, done_count: 0}; // 예외 발생 시에도 기본값 반환
        }
    }

    async getTodoById(id: string) {
        try {
            return await this.todoRepository.findOneBy({id});
        } catch (err) {
            console.error(`Failed to find todo: [${id}]`, err);
            return null;
        }
    }

    async addTodo(request: TodoCreateRequest) {
        try {
            const todo = new Todo();
            todo.userId = request.userId;
            todo.sort = request.sort;
            todo.content = request.content;
            todo.status = request.status || false;
            todo.date = request.date;
            todo.categoryId = request.categoryId;

            const saved = await this.todoRepository.save(todo);
            return saved;
        } catch (err) {
            console.error('Failed to add todo:', err);
            return null;
        }
    }

    async updateTodo(id: string, request: TodoUpdateRequest) {
        try {
            const todo = await this.getTodoById(id);
            if (!todo) {
                throw new Error(`Failed to find todo: [${id}]`);
            }

            const updateFields: Partial<Todo> = {};

            switch (request.updateType) {
                case UpdateType.sort:
                    updateFields.sort = request.value;
                    break;
                case UpdateType.content:
                    updateFields.content = request.value;
                    break;
                case UpdateType.status:
                    updateFields.status = Boolean(request.value);
                    break;
                case UpdateType.date:
                    updateFields.date = request.value;
                    break;
                case UpdateType.timeAt:
                    updateFields.timeAt = request.value;
                    break;
                case UpdateType.timeAmpm:
                    updateFields.timeAmpm = request.value;
                    break;
                default:
                    throw new Error(`Unknown update type: ${request.updateType}`);
            }

            await this.todoRepository.update(id, updateFields);
        } catch (err) {
            console.error('Failed to update todo:', err);
            throw err;
        }
    }

    async deleteTodo(userId: string, id: string) {
        try {
            return await this.todoRepository.softDelete({userId, id});
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    }

    async deleteTodoByCategoryId(userId: string, categoryId: string)  {
        try {
            return await this.todoRepository.softDelete({userId, categoryId});
        } catch (err) {
            console.error('Failed to delete todo:', err);
        }
    }

    async getDoneDates(userId:string, selectedYM: string) {
        try {
            const rows: { date: string }[] = await this.todoRepository.query(`
            WITH done_count AS (
                SELECT date
                    , count(*) as count
                FROM todo
                WHERE deleted_at is null
                AND (status = 1 OR status = true)
                AND date like ?||'%'
                AND user_id = ?
                GROUP BY date
            )
            , all_count AS (
                SELECT date
                    , count(*) as count
                FROM todo
                WHERE deleted_at is null
                  AND date like ?||'%'
                  AND user_id = ?
                GROUP BY date
            ) 
            SELECT d.date as date
            FROM done_count d
            INNER JOIN all_count a ON d.date = a.date
            WHERE d.count = a.count;
        `, [selectedYM, userId, selectedYM, userId]);
            return rows.map(row => row.date);
        } catch (err) {
            console.error('Failed to delete todo:', err);
            return [];
        }
    }
}