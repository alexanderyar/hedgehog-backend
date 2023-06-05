import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm"

export class AddShipInfoToOrder1685928549018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('orders', new TableColumn({
            name: 'ship_id',
            type: 'integer',
            isNullable: false
        }))
        await queryRunner.createForeignKey('orders', new TableForeignKey(
            {
                name: 'orders_ship_info',
                referencedColumnNames: ['id'],
                referencedTableName: 'ship_info',
                columnNames: ['ship_id']
            }
        ))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
