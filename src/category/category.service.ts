import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Category} from "@/entities/category.entity";
import {CategoryCreateRequest, CategoryUpdateRequest} from "@/dto/category.dto";
import {UpdateType} from "@/dto/category.dto";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    async getCategory(id: string) {
        try {
            return await this.categoryRepository.findOneBy({id});
        } catch (err) {
            console.error(`Failed to find category: [${id}]`, err);
            return null;
        }
    }
    
    async getCategories(userId:string) {
        try {
            return await this.categoryRepository.find({
                where: {
                    userId: userId,
                },
                order: {
                    sort: "ASC",
                },
                withDeleted: false,
            });
        } catch (err) {
            console.error('Failed to get categories', err);
            return [];
        }
    }
    
    async addCategory(request: CategoryCreateRequest) {
        try {
            const category = new Category();
            category.content = request.content;
            category.color = request.color;
            category.sort = request.sort;
            category.userId = request.userId;

            const saved = await this.categoryRepository.save(category);
            return saved;
        } catch (err) {
            console.error('Failed to add category:', err);
            return null;
        }
    }
    
    async updateCategory(id: string, request: CategoryUpdateRequest) {
        try {
            const category = await this.getCategory(id);
            if (!category) {
                throw new Error(`Failed to find category: [${id}]`);
            }

            const updateFields: Partial<Category> = {};

            switch (request.updateType) {
                case UpdateType.sort:
                    updateFields.sort = request.value;
                    break;
                case UpdateType.content:
                    updateFields.content = request.value;
                    break;
                case UpdateType.color:
                    updateFields.color = request.value;
                    break;
                default:
                    throw new Error(`Unknown update type: ${request.updateType}`);
            }

            await this.categoryRepository.update(id, updateFields);
        } catch (err) {
            console.error('Failed to update category:', err);
            throw err;
        }
    }
    
    async deleteCategory(userId: string, id: string) {
        try {
            return await this.categoryRepository.softDelete({userId, id});
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    }
}