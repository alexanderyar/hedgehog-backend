import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"
import {boolean} from "joi";

export class AddDeletedMarkShipInfo1689030264838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('ship_info', new TableColumn({
            name: 'deleted',
            type: 'boolean',
            isNullable: true,
            default: false
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
