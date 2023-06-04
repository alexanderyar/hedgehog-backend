import { MigrationInterface, QueryRunner } from "typeorm"

export class FixOrderStatuses1685168874225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
ALTER TYPE order_statuses ADD VALUE 'manager_review';
ALTER TYPE order_statuses rename to order_statuses_old;
Create Type order_statuses as ENUM ('created', 'manager_review', 'payment_pending', 'packaging', 'delivery', 'delivered', 'cancelled');
Update orders SET status = 'created' where status = 'in_progress';
ALTER TABLE orders ALTER COLUMN status SET DATA TYPE order_statuses USING (status::TEXT::order_statuses); 
DROP TYPE IF EXISTS order_statuses_old;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
