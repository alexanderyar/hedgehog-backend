import {NextFunction, Request, Response} from "express";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import ordersRepo from "../../repositories/Orders.repo";
import Order from "../../entity/Order.entity";
import UseRole from "../../decorators/UseRole";
import ParsePathParams from "../../decorators/ParsePathParams";
import OrderStatuses from "../../enums/OrderStatuses";

class OrdersController {

    // @UseRole(UserRoles.customer)
    async getAll(req:Request<any, any,any, {client_id?: string}>, res:Response, next:NextFunction) {
        if (req.user.role === UserRoles.customer) {
            const client = await Client.findOne({where: {user_id: req.user.id}});
            if (!client) {
                throw new Error('Client is not found. user.id:' + req.user.id);
            }
            const data = await ordersRepo.getOrdersWithPriceByClient(client.id);
            res.json(data);
        } else if (req.user.role === UserRoles.sales_manager) {
            const client_id = parseInt(req.query.client_id!) || undefined;
            const orders = await Order.find({
                where: {
                    client_id: client_id,
                    client: {
                        manager_id: req.user.id
                    }
                },
                relations: ['client']
            })
            res.send(orders);
        }
    }

    @ParsePathParams([{param: 'id', type: 'number'}])
    async getDetails(req:Request<{id: number}>, res:Response, next:NextFunction) {
        const id = req.params.id;
        const order = await Order.findOne({
            where: {id},
            relations: ['nomenclatures', 'nomenclatures.nomenclature']
        })
        res.send(order)
    }

    @UseRole(UserRoles.sales_manager)
    @ParsePathParams([{param: 'orderId', type: 'number'}])
    async updateOrderStatus(req:Request<{ orderId:number }>, res:Response, next:NextFunction) {
        const order = await Order.findOne({
            where: {
                id: req.params.orderId,
                client: {manager_id: req.user.id}
            },
            // relations:
        })
        if (!order) {
            res.status(404);
            res.send({message: 'Order is not found'});
            return;
        }
        const newStatusFromBody = req.body.newValue as OrderStatuses;

        // @ts-ignore
        const statusCheck = OrderStatuses[newStatusFromBody];
        if (!statusCheck) {
            res.status(400);
            res.send({message: 'Wrong new status'});
            return;
        }
        order.status = newStatusFromBody;
        await order.save();

        res.send()
    }
}

export default new OrdersController();