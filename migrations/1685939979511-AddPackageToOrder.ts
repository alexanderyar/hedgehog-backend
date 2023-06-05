import {MigrationInterface, QueryRunner, TableColumn} from "typeorm"

export class AddPackageToOrder1685939979511 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('order_by_nomenclature', [
            new TableColumn({
                name: 'package',
                type: 'varchar',
                length: '128',
                isNullable: true
            }),
            new TableColumn({
                name: 'approved_price',
                type: 'numeric',
                isNullable: true
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('order_by_nomenclature', 'package')
    }

}
