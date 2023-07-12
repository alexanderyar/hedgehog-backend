import dataSource from "../dataSource";
import Order from "../entity/Order.entity";
import UserRoles from "../enums/UserRoles";

const OrdersRepo = dataSource.getRepository(Order).extend({
  async getOrdersWithPriceByClient(clientId: number) {
    const query = `WITH 
order_prices as (
Select order_id, 
sum(COALESCE(approved_price, price) * quantity) as price
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
Select order_id, 
sum(price * quantity) as price
from order_by_nomenclature
group by order_id
)
Select 
id,
order_prices.price
From orders
left join order_prices on order_id = id;`;
    return await this.query(query);
  },
  /////////////////////////////
  /////////////////////////////
  async getOrdersOfClients(managerId?: number, userRole: UserRoles | '' = '') {
    const query = `WITH 
clients_orders as (
Select order_id, 
sum(COALESCE(approved_price, price) * quantity) as price
from order_by_nomenclature
where order_id in (select id from orders where client_id in (Select id from clients where manager_id = $1 or $2))
group by order_id
)
Select 
orders.id,
client_id,
status,
clients_orders.price,
clients.formatted_id
From orders
left join clients_orders on order_id = id
JOIN clients ON orders.client_id = clients.id;`;
    return await this.query(query, [managerId, UserRoles.admin === userRole]);
  },
});

export default OrdersRepo;
