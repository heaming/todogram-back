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

@Entity("category")
export class Category {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    sort: string;

    @Column()
    content: string;

    @Column({nullable: true})
    color: string;

    @CreateDateColumn({ type: "datetime" })
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
