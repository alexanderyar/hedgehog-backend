import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class Country1684111855209 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('users', new TableColumn({
            name: 'country',
            type: 'text',
        }))
        await queryRunner.addColumn('users', new TableColumn({
            name: 'telephone_number',
            type: 'integer',
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
