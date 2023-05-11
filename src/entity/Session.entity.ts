import { access } from "fs";
import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("session")
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  refresh_token: string;

  ////////// !!!!!!!!!!!!! /////////
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "user_id" })
  user: User;
}
