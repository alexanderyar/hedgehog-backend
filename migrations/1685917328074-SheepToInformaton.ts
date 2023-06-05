import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm"

export class SheepToInformaton1685917328074 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ship_info',
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
                    name: 'client_id',
                    type: 'integer',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'ship_to',
                    type: 'text',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'bill_to',
                    type: 'text',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'bank_info',
                    type: 'text',
                    isNullable: true
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    name: 'ship_info_clients',
                    referencedColumnNames: ['id'],
                    referencedTableName: 'clients',
                    columnNames: ['client_id']
                })
            ]
        }))
        await queryRunner.query(
`Insert INTO ship_info(client_id, ship_to, bill_to, bank_info)
 select
 id as client_id,
  ship_to,
  bill_to,
  bank_info
 from clients`
        );
        await queryRunner.dropColumns('clients', ['ship_to', 'bill_to', 'bank_info'])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('ship_info','ship_info_clients')
        await queryRunner.dropTable('ship_info')
    }

}
