import { access } from "fs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from "typeorm";
import UserRoles from "../enums/UserRole";
import Supplier from "./Supplier.entity";

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.customer,
  })
  role: UserRoles;

  @Column({
    default: true,
    name: "access_granted",
  })
  access_granted: Boolean;

  @Column({ type: "varchar", length: "64" })
  login: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ nullable: true })
  token: string;

  @Column()
  verification_token: string;

  @Column({ default: false })
  verified_email: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Supplier, (supplier) => supplier.manager)
  suppliers: Supplier[]
}
