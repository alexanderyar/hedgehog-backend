import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import OrderStatuses from "../enums/OrderStatuses";
import OrderByNomenclature from "./OrderByNomenclature.entity";
import Client from "./Client.entity";

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

    @ManyToOne(()=> Client, (client) => client.orders)
    @JoinColumn({name: 'id'})
    client: Client;
}