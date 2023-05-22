import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm"

export class AddedImagesTable1684715101770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'datasheets',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    isUnique: true,
                    generationStrategy: "increment",
                }),
                new TableColumn({
                    name: 'nomenclature_id',
                    type: 'integer',
                    isNullable: false,
                    isUnique: true
                }),
                new TableColumn({
                    name: 'file_name',
                    type: 'text',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'file',
                    type: 'bytea',
                    isNullable: false
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    name: 'datasheets_nomenclatures',
                    referencedTableName: "nomenclatures",
                    referencedColumnNames: ["id"],
                    columnNames: ["nomenclature_id"],
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('datasheets', 'datasheets_nomenclatures');
        await queryRunner.dropTable('datasheets');
    }

}
