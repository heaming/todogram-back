import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import {ulid} from "ulid";

@Entity("todo")
export class Todo {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    sort: string;

    @Column()
    content: string;

    @Column({ default: false })
    status: boolean;

    @Column()
    date: string;

    @Column({ nullable: true })
    timeAt: string;

    @Column({ nullable: true })
    timeAmpm: string;

    @Column()
    categoryId: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = ulid();
        }
    }
}
