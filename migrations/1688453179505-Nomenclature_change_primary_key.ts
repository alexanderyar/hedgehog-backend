import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableUnique} from "typeorm"

export class NomenclatureChangePrimaryKey1688453179505 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const constraints = [
            {
                table: 'stock_balances',
                constraintName: 'stock_balance_nomenclature',
                columnNames: ["part_number"],
                rc: ['number']
            },
            {
                table: 'order_by_nomenclature',
                constraintName: 'order_by_nomenclature_nomenclatures',
                columnNames: ["nomenclature_id"],
            },
            {
                table: 'replacements',
                constraintName: 'replacements_nomenclatures',
                columnNames: ["nomenclature_id"],
            },
            {
                table: 'replacements',
                constraintName: 'replacements_nomenclatures_repl',
                columnNames: ['replacement_id']
            },
            {
                table: 'datasheets',
                constraintName: 'datasheets_nomenclatures',
                columnNames: ["nomenclature_id"],
            }
        ]
        for (let i = 0; i < constraints.length; i++) {
            const fk = constraints[i];
            await queryRunner.dropForeignKey(fk.table, fk.constraintName)
        }
        // await queryRunner.dropForeignKey('stock_balances', 'stock_balance_nomenclature')
        await queryRunner.createUniqueConstraint('nomenclatures', new TableUnique({
            columnNames: ['id']
        }))
        await queryRunner.dropPrimaryKey('nomenclatures');
        for (let i = 0; i < constraints.length; i++) {
            const fk = constraints[i];
            await queryRunner.createForeignKey(fk.table,new TableForeignKey({
                name: fk.constraintName,
                referencedTableName: "nomenclatures",
                referencedColumnNames: fk.rc || ["id"],
                columnNames: fk.columnNames,
            }))
        }
        await queryRunner.createPrimaryKey('nomenclatures', ['number'], 'PK_Number');
        await queryRunner.dropColumn('stock_balances', 'nomenclature_id');
        await queryRunner.dropPrimaryKey('stock_balances')
        await queryRunner.dropColumn('stock_balances', 'id')
        await queryRunner.createPrimaryKey('stock_balances', ['part_number'], 'PK_stock_balance_Number');
        await queryRunner.changeColumn('stock_balances', 'brand', new TableColumn({
            name: 'brand',
            type: 'varchar',
            length: '50',
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropPrimaryKey('nomenclatures');
        await queryRunner.createPrimaryKey('nomenclatures', ['id'], 'PK_Number')
    }

}
