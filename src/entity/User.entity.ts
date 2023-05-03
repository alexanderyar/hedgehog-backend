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
export enum userRole {
  customer,
  supplier, //Do we need it?
  supply_manager,
  sales_manager,
  admin,
}

@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({
    type: "enum",
    enum: userRole,
    default: userRole.customer,
  })
  role: userRole;

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
  verificationToken: string;

  @Column({ default: false, nullable: true })
  verifiedEmail: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
