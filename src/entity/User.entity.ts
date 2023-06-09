import { access } from "fs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import UserRoles from "../enums/UserRoles";
import { Session } from "./Session.entity";
import Client from "./Client.entity";

@Entity("users")
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
  telephone_number: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ default: false })
  verified_email: boolean;

  ////////// !!!!!!!!!!!!! /////////
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToOne(() => Client, (client) => client.user)
  client?: Client;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
