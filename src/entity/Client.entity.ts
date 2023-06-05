import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";
import { ClientTypes } from "../enums/ClientTypes";
import Order from "./Order.entity";
import Contract from "./Contract.entity";
import ShipIfo from "./ShipIfo.entity";

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
  company_name: string;

  @Column()
  type: "enum";
  enum: ClientTypes;

  @Column()
  ceo_name: string;

  @Column()
  country: string;

  @Column()
  formatted_id: string;

  @OneToMany(()=> ShipIfo, (shipInfo)=> shipInfo.client)
  ship_infos: ShipIfo[];

  @OneToMany(() => Order, (order) => order.client)
      // @JoinColumn({name: 'id'})
  orders: Order[]

  @OneToOne(() => Contract, (contract) => contract.client)
      // @JoinColumn({name: 'id'})
  contract: Contract;
}
