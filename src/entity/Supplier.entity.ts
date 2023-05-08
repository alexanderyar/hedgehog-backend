import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";

@Entity()
export default class Supplier extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    manager_id: number;

    @Column({
        length: 128
    })
    name: string;

    @ManyToOne(() => User, (user) => user.suppliers )
    manager: User
}