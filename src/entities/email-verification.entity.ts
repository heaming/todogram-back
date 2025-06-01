import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('email_verification')
export class EmailVerification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    code: string;

    @Column({ type: 'datetime' })
    expiresAt: Date;

    @Column({ type: 'datetime', nullable: true })
    verifiedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}