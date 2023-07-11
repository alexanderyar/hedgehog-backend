import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    VirtualColumn
} from "typeorm";
import Order from "./Order.entity";
import Nomenclature from "./Nomenclature.enity";
import StockRepository from "../repositories/StockBalance.repo";

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

    @Column()
    package: string;

    @Column()
    approved_price: number;

    @ManyToOne(() => Order, (order)=> order.nomenclatures)
    @JoinColumn({name: 'order_id'})
    order: Order;

    @ManyToOne(() => Nomenclature)
    @JoinColumn({name: 'nomenclature_id'})
    nomenclature: Nomenclature;

    part_number: string;

    @BeforeInsert()
    async addPrice() {
        const data = await StockRepository.getPrice(this);
        if (!data.length) {
            throw new Error('failed to find stocks')
        }

        this.price = data[0].min_price || 0;
    }
}