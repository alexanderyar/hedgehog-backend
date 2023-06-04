import {BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne,
  PrimaryGeneratedColumn,} from "typeorm";
import {User} from "./User.entity";
import Order from "./Order.entity";
import Contract from "./Contract.entity";

@Entity({
  name: "clients",
})
export default class Client extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  manager_id: number;

  @Column()
  track_manager: boolean;

  @Column()
  check_delay: number;

  @OneToOne(() => User, (user) => user.client)
  user: User;

  @Column()
  address: string;

  @Column()
  ceo_name: string;

  @Column()
  bank_info: string;

  @Column()
  bill_to: string;

  @Column()
  ship_to: string;

  @OneToMany(() => Order, (order) => order.client)
      // @JoinColumn({name: 'id'})
  orders: Order[]

  @OneToOne(() => Contract, (contract) => contract.client)
      // @JoinColumn({name: 'id'})
  contract: Contract;
}