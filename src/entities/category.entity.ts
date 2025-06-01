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

@Entity("Category")
export class Category {
    @PrimaryColumn()
    id: string;

    @Column()
    user_id: string;

    @Column()
    sort: string;

    @Column()
    content: string;

    @Column({nullable: true})
    color: string;

    @CreateDateColumn({ type: "datetime" })
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
