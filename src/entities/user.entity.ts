import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ulid} from "ulid";

@Entity("toodogram_user")
export class User {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    userId: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    username: string;

    @Column({ nullable: true, default: 'local' })
    provider: 'local' | 'kakao' | 'google';

    @Column({ nullable: true })
    providerId: string; // ex) Kakao user id

    @Column({default: true, nullable: true})
    emailVerified: boolean;

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