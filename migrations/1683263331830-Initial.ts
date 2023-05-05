import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm"
import UserRole from "../src/enums/UserRole";
import UserRoles from "../src/enums/UserRole";
import OrderStatuses from "../src/enums/OrderStatuses";

export class Initial1683263331830 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                    name: 'role',
                    type: 'enum',
                    enum: Object.values(UserRole),
                    enumName: 'user_roles',
                    isNullable: false,
                    default: `'${UserRoles.customer}'`
                }),
                new TableColumn({
                    name: 'access_granted',
                    type: 'boolean',
                    default: true,
                    isNullable: false
                }),
                new TableColumn({
                    name: 'login',
                    type: 'varchar',
                    length: '64',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'password',
                    type: 'varchar',
                    length: '256',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'email',
                    type: 'varchar',
                    length: '128',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'token',
                    type: 'text',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'verification_token',
                    type: 'text',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'verified_email',
                    type: 'boolean',
                    default: false
                }),
                new TableColumn({
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: true
                }),
                new TableColumn({
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: true
                })
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'nomenclatures',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                   name: 'number',
                   type: 'text',
                   isNullable: false
                }),
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'suppliers',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                    name: 'manager_id',
                    type: 'integer',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'name',
                    type: 'varchar',
                    length: '128',
                    isNullable: false
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['manager_id'],
                    name: 'suppliers_users'
                })
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'clients',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                    name: 'user_id',
                    type: 'integer',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'manager_id',
                    type: 'integer',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'track_manager',
                    type: 'boolean',
                    default: false,
                }),
                new TableColumn({
                    name: 'check_delay',
                    type: 'integer',
                    isNullable: true,
                }),
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['manager_id'],
                    name: 'clients_users'
                }),
                new TableForeignKey({
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['user_id'],
                    name: 'clients_users_manager'
                })
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'stock_balances',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                    name: 'nomenclature_id',
                    type: 'integer',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'supplier_id',
                    type: 'integer',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'balance',
                    type: 'integer',
                    isNullable: false,
                }),
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'nomenclatures',
                    referencedColumnNames: ['id'],
                    columnNames: ['nomenclature_id'],
                    name: 'stock_balance_nomenclature'
                }),
                new TableForeignKey({
                    referencedTableName: 'suppliers',
                    referencedColumnNames: ['id'],
                    columnNames: ['supplier_id'],
                    name: 'stock_balance_suppliers'
                })
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'orders',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                    name: 'client_id',
                    type: 'integer',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'status',
                    type: 'enum',
                    enum: Object.keys(OrderStatuses),
                    enumName: 'order_statuses',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'comment',
                    type: 'text',
                    isNullable: true
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'clients',
                    referencedColumnNames: ['id'],
                    columnNames: ['client_id'],
                    name: 'orders_clients'
                })
            ]
        }))
        await queryRunner.createTable(new Table({
            name: 'order_by_nomenclature',
            columns: [
                this.getIdColumn(),
                new TableColumn({
                   name: 'order_id',
                   type: 'integer',
                   isNullable:false,
                }),
                new TableColumn({
                    name: 'nomenclature_id',
                    type: 'integer',
                    isNullable: false
                }),
                new TableColumn({
                    name: 'quantity',
                    type: 'real',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'comment',
                    type: 'text',
                    isNullable: true,
                })
            ],
            foreignKeys: [
                new TableForeignKey({
                    referencedTableName: 'orders',
                    referencedColumnNames: ['id'],
                    columnNames: ['order_id'],
                    name: 'order_by_nomenclature_orders'
                }),
                new TableForeignKey({
                    referencedTableName: 'nomenclatures',
                    referencedColumnNames: ['id'],
                    columnNames: ['nomenclature_id'],
                    name: 'order_by_nomenclature_nomenclatures'
                })
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

    private getIdColumn(name='id'): TableColumn {
        return new TableColumn({
            name,
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            isUnique: true,
            generationStrategy: 'increment'
        })
    }

}
