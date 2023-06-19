import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Brands from "../enums/Brands";
import Replacement from "./Replacement";
import nomenclature from "../controllers/nomenclature";


@Entity({ name: "nomenclatures" })
export default class Nomenclature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "number",
  })
  part_number: string;

  @ManyToMany(()=> Nomenclature, (nomenclature) => nomenclature.replacements)
  @JoinTable({
    name: 'replacements',
    joinColumn: {name: 'nomenclature_id'},
    inverseJoinColumn: {name: 'replacement_id'}
  })
  replacements: Nomenclature[];
}
