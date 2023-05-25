import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import OrderStatuses from "../enums/OrderStatuses";
import OrderByNomenclature from "./OrderByNomenclature.entity";

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

    @OneToMany(()=> OrderByNomenclature, (ordByNom) => ordByNom.order)
    nomenclatures: OrderByNomenclature[];
}