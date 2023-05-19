import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: 'suppliers'
})
export default class Supplier extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    manager_id: number;

    @Column()
    name: string;
}