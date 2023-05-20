import StockBalance from "../entity/StockBalance.entity";
import dataSource from "../dataSource";

const StockRepository = dataSource.getRepository(StockBalance).extend({

    findGrouped(skip?:number, take?:number, number?: string, id?: number) {
        const offset = !skip? '' : `OFFSET ${skip}`;
        const limit = !take? '' : `LIMIT ${take}`;
        const filterByName = !number ? '' : ` and nomenclatures.number like '%${number}%'`;
        let filterById = '';

        if (id) {
            filterById = ` and nomenclature_id in (SELECT 
replacement_id as id
FROM public.replacements
where nomenclature_id = ${id})`;
        }
        const query = `
with stock as (
SELECT
stock_balances.nomenclature_id as id,
nomenclatures.number as part_number,
nomenclatures.brand,
nomenclatures.package,
nomenclatures.manufacture_date,
sum(stock_balances.balance) as balance
FROM 
stock_balances
left join nomenclatures on nomenclatures.id = stock_balances.nomenclature_id
GROUP BY nomenclature_id, nomenclatures.number, brand, package, manufacture_date
HAVING sum(stock_balances.balance) > 0 ${filterByName} ${filterById}
${limit} 
${offset}
),
has_replacement as (
SELECT 
nomenclature_id,
true::boolean as present
FROM public.replacements
Group By nomenclature_id
)

SELECT
stock.id,
stock.part_number,
stock.balance,
brand, 
package, 
manufacture_date,
COALESCE(has_replacement.present, false) as present
from stock
left join has_replacement on has_replacement.nomenclature_id = stock.id
`;


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