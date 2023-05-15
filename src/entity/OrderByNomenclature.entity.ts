import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}