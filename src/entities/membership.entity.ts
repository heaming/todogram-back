import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity('membership')
export class Membership {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userId: string;

    @Column()
    membershipPlan: string;

    @Column({ type: 'timestamp' })
    startedAt: Date;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ default: false })
    isAutoRenew: boolean;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ type: "datetime" })
    createdAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;
}