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

@Entity("Todo")
export class Todo {
    @PrimaryColumn()
    id: string;

    @Column()
    user_id: string;

    @Column()
    sort: string;

    @Column()
    content: string;

    @Column({ default: false })
    status: boolean;

    @Column()
    date: string;

    @Column({ nullable: true })
    time_at: string;

    @Column({ nullable: true })
    time_ampm: string;

    @Column()
    category_id: string;

    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = ulid();
        }
    }
}
