import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'stock_balances'})
export default class StockBalance extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nomenclature_id: number;

    @Column()
    supplier_id: number;

    @Column()
    balance: number;
}