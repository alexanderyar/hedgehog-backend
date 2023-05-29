enum OrderStatuses {
    created = 'Created',
    manager_review = 'Manager review',
    payment_pending = 'Payment pending',
    packaging = 'Packaging',
    delivery = 'Delivery',
    delivered = 'Delivered',
    cancelled = 'Cancelled',
}

const OrderStatusesMap = new Map();

for (let key in OrderStatuses) {

    // @ts-ignore
    const val = OrderStatuses[key];
    OrderStatusesMap.set(key, val)
    OrderStatusesMap.set(val, key)

}

export { OrderStatusesMap };

export default OrderStatuses;