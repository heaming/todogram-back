import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    amount: number;

    @Column()
    status: 'PAID' | 'FAILED' | 'CANCELED';

    @Column()
    paymentMethod: string;

    @Column({ type: 'timestamp' })
    paidAt: Date;

    @Column({ nullable: true })
    externalTransactionId: string;
}