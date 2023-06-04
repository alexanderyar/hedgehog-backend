import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Brands from "../enums/Brands";
@Entity({ name: "nomenclatures" })
export default class Nomenclature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "number",
  })
  part_number: string;

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
