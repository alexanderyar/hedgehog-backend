import StockBalance from "../entity/StockBalance.entity";
import dataSource from "../dataSource";

const StockRepository = dataSource.getRepository(StockBalance).extend({

    findGrouped(skip?:number, take?:number, number?: string) {
        const offset = !skip? '' : `OFFSET ${skip}`;
        const limit = !take? '' : `LIMIT ${take}`;
        const filterByName = !number ? '' : ` and nomenclatures.number like '%${number}%'`;

        const query = `
        SELECT 
stock_balances.nomenclature_id as id,
nomenclatures.number as part_number,
sum(stock_balances.balance) as balance
FROM 
stock_balances
left join nomenclatures on nomenclatures.id = stock_balances.nomenclature_id
GROUP BY nomenclature_id, nomenclatures.number
HAVING sum(stock_balances.balance) > 0 ${filterByName}
${limit} 
${offset}`;


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