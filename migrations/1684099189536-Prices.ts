import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class Prices1684099189536 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('order_by_nomenclature', new TableColumn({
            name: 'price',
            type: 'numeric',
            default: 0
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
