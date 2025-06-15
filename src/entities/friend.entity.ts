import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn, PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ulid} from "ulid";

@Entity("friend")
export class Friend {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    friendId: string;

    @CreateDateColumn({ type: "datetime" })
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
}
