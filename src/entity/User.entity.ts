import { access } from "fs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

// later move to a separate file for enums, types, interfaces? @K
enum userRole {
  customer,
  supplier, //Do we need it?
  supply_manager,
  sales_manger,
  admin,
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({
    type: "enum",
    enum: userRole,
  })
  role: userRole;

  @Column({
    default: false,
    name: "access_granted",
  })
  access_granted: Boolean;

  @Column({ type: "varchar" })
  login: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
