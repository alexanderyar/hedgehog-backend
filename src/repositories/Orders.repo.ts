import dataSource from "../dataSource";
import Order from "../entity/Order.entity";

const OrdersRepo = dataSource.getRepository(Order).extend({
   async getOrdersWithPriceByClient(clientId: number) {
        const query = `WITH 
order_prices as (
Select order_id, sum(price) as price
from order_by_nomenclature
where order_id in (select id from orders where client_id = $1)
group by order_id
)
Select 
id,
client_id,
status,
order_prices.price
From orders
left join order_prices on order_id = id
where client_id = $1`;
        return await this.query(query, [clientId]);
    },

    async getOrdersWithPrice() {
        const query = `WITH order_prices as (
Select order_id, sum(price) as price
from order_by_nomenclature
group by order_id
)
Select 
id,
order_prices.price
From orders
left join order_prices on order_id = id;`;
        return await this.queryRunner?.query(query);
    }
})

export default OrdersRepo;