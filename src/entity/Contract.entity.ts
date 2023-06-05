import {AfterLoad, BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Client from "./Client.entity";

@Entity({name: 'contracts'})
export default class Contract extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    client_id: number;

    @Column()
    file_name:string;

    @Column()
    file: string;

    @OneToOne(()=> Client, (client) => client.contract)
    @JoinColumn({name: 'client_id'})
    client: Client;

    @AfterLoad()
    makeBuffer() {
        this.file_buffer = Buffer.from(this.file, "hex");
    }
    file_buffer: Buffer;
}