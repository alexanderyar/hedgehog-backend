import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "suppliers",
})
export default class Supplier extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manager_id: number;

  @Column()
  company_name: string;

  @Column()
  company_name_chinese: string;

  @Column()
  address: string;

  @Column()
  bank_info: string;

  @Column()
  contact_name: string;

  @Column()
  email: string;

  @Column()
  type: string;

  @Column()
  additional_info: string;

  @Column()
  formatted_id: string;
}
