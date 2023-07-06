import StockBalance from "../entity/StockBalance.entity";
import dataSource from "../dataSource";
import OrderByNomenclature from "../entity/OrderByNomenclature.entity";
type optsByPartNumber = {
    findByPartNumber?: string,
    findById?: never;
    findByReplacementId?: never
}
type optsByById = {
    findById: number,
    findByPartNumber?: never;
    findByReplacementId?: never;
}
type optsByReplacementId = {
    findByReplacementId: string,
    findById?: never;
    findByPartNumber?: never;
}
type options = optsByPartNumber | optsByById | optsByReplacementId;

const StockRepository = dataSource.getRepository(StockBalance).extend({

    findGrouped(offsetParams?: {skip?: number, take?:number}, options?: options):Promise<Record<any, any>> {
        let offset = '';
        let limit = '';
        if (offsetParams) {
            offset = !offsetParams.skip? '' : `OFFSET ${offsetParams.skip}`;
            limit = !offsetParams.take? '' : `LIMIT ${offsetParams.take}`;
        }
        let filterByName = '';
        let filterById = '';
        if (options) {
            if (options.findByPartNumber ) {
                const findByPartNumber = options.findByPartNumber;
                filterByName = !findByPartNumber ? '' : ` and LOWER(nomenclatures.number) like LOWER('%${findByPartNumber}%')`;
            } else if (options.findByReplacementId) {
                filterById = ` and part_number in (SELECT 
nomenclatures.number as part_number
FROM public.replacements
inner join nomenclatures on replacements.nomenclature_id = nomenclatures.id
where nomenclatures.number = '${options.findByReplacementId}' )`;
            } else if (options.findById) {
                filterById = ` and nomenclature_id=${options.findById}`
            }
        }

        const query = `
with stock as (
SELECT
nomenclatures.number as part_number,
brand,
package,
manufacture_date,
min(price) as min_price,
max(price) as max_price,
sum(stock_balances.balance) as balance
FROM 
stock_balances
left join nomenclatures on nomenclatures.number = stock_balances.part_number
GROUP BY part_number, nomenclatures.number, brand, package, manufacture_date
HAVING sum(stock_balances.balance) > 0 ${filterByName} ${filterById}
${limit} 
${offset}
),
has_replacement as (
SELECT 
nomenclatures.number,
true::boolean as present
FROM public.replacements
left join nomenclatures on nomenclatures.id = nomenclature_id
Group By number
),
datasheetsForm as (
SELECT 
nomenclatures.number,
true::boolean as present
FROM public.datasheets
left join nomenclatures on nomenclatures.id = nomenclature_id
Group By number
)SELECT
stock.part_number,
stock.balance,
stock.min_price,
stock.max_price,
brand, 
package, 
manufacture_date,
COALESCE(has_replacement.present, false) as present,
datasheetsForm.present AS has_datasheet
from stock
left join has_replacement on has_replacement.number = stock.part_number
left join datasheetsForm on datasheetsForm.number = stock.part_number
`;
        return this.query(query);
    },
    getPrice(stockData: Partial<OrderByNomenclature>) {
        const query = `
        SELECT
nomenclature_id as id,
brand,
package,
manufacture_date,
min(price) as min_price,
max(price) as max_price,
sum(balance) as balance
FROM 
stock_balances
where nomenclature_id=$1
GROUP BY nomenclature_id, brand, package, manufacture_date
`
        return this.query(query, [stockData.nomenclature_id])
    },

    getGroupedCount() {
        const queryBuilder = this.createQueryBuilder();
        const count = queryBuilder
            .select('stock_balances.nomenclature_id, sum(stock_balances.balance)')
            .from(StockBalance, 'stock_balances')
            .groupBy('stock_balances.nomenclature_id').having('sum(stock_balances.balance) > 0').getCount();

        return count;
    },

    getNomenclatures() {
        const query = `
        SELECT 
        nomenclatures.id,
nomenclatures.number as part_number,
CASE WHEN count(datasheets.id) > 0 
    then true
    else false
END AS has_datasheet,
CASE WHEN count(replacements.id) > 0 
    then true
    else false
END AS present
from nomenclatures
left join datasheets on nomenclatures.id = datasheets.nomenclature_id
left join replacements on nomenclatures.id = replacements.nomenclature_id
group by nomenclatures.id, nomenclatures.number
        `
        return this.query(query)
    },

    async getInfoById(id: number) {
        const query = `
            WITH 
            datasheet as (
                Select 
                    id,
                    nomenclature_id
                    from 
                    datasheets
                    where nomenclature_id=$1
                    limit 1
            ),
            has_replacement as (
                SELECT 
                nomenclature_id,
                true::boolean as present
                FROM public.replacements
                where nomenclature_id = $1
                Group By nomenclature_id
            )
            select 
            nomenclatures.*,
            CASE WHEN datasheet.id IS NULL 
                THEN false 
                ELSE true 
            END AS has_datasheet,
            COALESCE(has_replacement.present, false) as present
            from
            nomenclatures
            left join datasheet on nomenclatures.id = datasheet.nomenclature_id
            left join has_replacement on has_replacement.nomenclature_id = nomenclatures.id
            where
            nomenclatures.id = $1
        `;

        return await this.query(query, [id])
    }
})

export default StockRepository