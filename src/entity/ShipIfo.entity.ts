import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Client from "./Client.entity";

@Entity('ship_info')
export default class ShipIfo extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    client_id: number

    @Column()
    bank_info: string;

    @Column()
    bill_to: string;

    @Column()
    ship_to: string;

    @ManyToOne(()=> Client, (client)=> client.ship_infos)
    @JoinColumn({name:'client_id'})
    client: Client;
}