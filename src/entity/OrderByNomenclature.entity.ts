import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Order from "./Order.entity";
import Nomenclature from "./Nomenclature.enity";

@Entity({
    name: 'order_by_nomenclature'
})
export default class OrderByNomenclature extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @Column()
    nomenclature_id: number;

    @Column()
    quantity: number;

    @Column()
    comment: string;

    @Column()
    price: number;

    @ManyToOne(() => Order, (order)=> order.nomenclatures)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @ManyToOne(() => Nomenclature)
    @JoinColumn({name: 'nomenclature_id'})
    nomenclature: Nomenclature;
}