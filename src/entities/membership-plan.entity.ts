import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('membership_plan')
export class MembershipPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    membershipPlan: 'FREE' | 'MONTHLY' | 'YEARLY';

    @Column({ nullable: true })
    price: number;

    @Column({ nullable: true })
    durationDays: number;
}