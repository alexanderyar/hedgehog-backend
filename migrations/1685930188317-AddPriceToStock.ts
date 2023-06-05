import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class AddPriceToStock1685930188317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('stock_balances', new TableColumn({
            name: 'price',
            type: 'NUMERIC',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
