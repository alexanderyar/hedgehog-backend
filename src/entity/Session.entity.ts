import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("sessions")
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer" })
  id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column()
  user_id: number;

  ////////// !!!!!!!!!!!!! /////////
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "user_id" })
  user: User;
}
