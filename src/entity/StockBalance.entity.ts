import {BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import Brands from "../enums/Brands";

@Entity({ name: "stock_balances" })
export default class StockBalance extends BaseEntity {

  @PrimaryColumn()
  part_number: string;

  @Column()
  supplier_id: number;

  @Column()
  balance: number;

  @Column()
  brand: string;

  @Column({
    length: 128,
  })
  package: string;

  @Column({
    name: "manufacture_date",
  })
  manufactureDate: string;
}
