import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Brands from "../enums/Brands";

@Entity({ name: "stock_balances" })
export default class StockBalance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomenclature_id: number;

  @Column()
  supplier_id: number;

  @Column()
  balance: number;

  @Column({})
  brand: Brands;

  @Column({
    length: 128,
  })
  package: string;

  @Column({
    name: "manufacture_date",
  })
  manufactureDate: string;
}
