import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity({name: 'nomenclatures'})
export default class Nomenclature extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'number'
    })
    part_number: string;
}