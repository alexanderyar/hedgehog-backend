import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Nomenclature from "./Nomenclature.enity";

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

    @ManyToOne(() => Nomenclature)
    @JoinColumn({name:'nomenclature_id'})
    nomenclature: Nomenclature

    @ManyToOne(() => Nomenclature)
    @JoinColumn({name:'replacement_id'})
    replacement: Nomenclature
}