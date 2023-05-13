import StockBalance from "../entity/StockBalance.entity";
import dataSource from "../dataSource";

const StockRepository = dataSource.getRepository(StockBalance).extend({

    findGrouped(skip?:number, take?:number) {
        const queryBuilder = this.createQueryBuilder();
        const query = queryBuilder
            .limit(take)
            .offset(skip)
            .select('stock_balances.nomenclature_id, sum(stock_balances.balance)')
            .from(StockBalance, 'stock_balances')
            .groupBy('stock_balances.nomenclature_id').having('sum(stock_balances.balance) > 0').getQuery();

        return this.query(query);
    },
    getGroupedCount() {
        const queryBuilder = this.createQueryBuilder();
        const count = queryBuilder
            .select('stock_balances.nomenclature_id, sum(stock_balances.balance)')
            .from(StockBalance, 'stock_balances')
            .groupBy('stock_balances.nomenclature_id').having('sum(stock_balances.balance) > 0').getCount();

        return count;
    }
})

export default StockRepository