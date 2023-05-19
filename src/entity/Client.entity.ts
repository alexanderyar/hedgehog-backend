import {BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User.entity";

@Entity({
    name: 'clients'
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
    user: User
}