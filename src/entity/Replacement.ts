import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({
    name: 'replacements'
})
export default class Replacement extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nomenclature_id: number;

    @Column()
    replacement_id: number;
}