import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"
import Brands from "../src/enums/Brands";

export class AddedToNomenclature1684546953305 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('nomenclatures', [
            new TableColumn({
                name: 'brand',
                type: 'enum',
                enumName: 'brands',
                enum: Object.keys(Brands),
                default: `'${Brands.origin}'`
            }),
            new TableColumn({
                name: 'package',
                type: 'varchar',
                length: '128',
                isNullable: true
            }),
            new TableColumn({
                name: 'manufacture_date',
                type: 'varchar',
                length: '24',
                isNullable: true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
