import { access } from "fs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import UserRoles from "../enums/UserRoles";
import { Session } from "./Session.entity";

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

  @Column()
  country: string;

  @Column({ nullable: true })
  telephone_number: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ default: false })
  verified_email: boolean;

  ////////// !!!!!!!!!!!!! /////////
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
