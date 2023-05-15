import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import OrderStatuses from "../enums/OrderStatuses";

@Entity({name: 'orders'})
export default class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    client_id: number;

    @Column()
    status: OrderStatuses;

    @Column({
        nullable: true
    })
    comment: string;
}