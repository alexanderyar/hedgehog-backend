import {AfterLoad, BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('datasheets')
export default class Datasheet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nomenclature_id: number;

    @Column()
    file_name: string;

    @Column()
    file: string;

    @AfterLoad()
    makeBuffer() {
        this.file_buffer = Buffer.from(this.file, "hex");
    }
    file_buffer: Buffer;
}