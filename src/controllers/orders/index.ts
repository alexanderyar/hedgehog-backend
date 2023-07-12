import {NextFunction, Request, Response} from "express";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import ordersRepo from "../../repositories/Orders.repo";
import Order from "../../entity/Order.entity";
import UseRole from "../../decorators/UseRole";
import ParsePathParams from "../../decorators/ParsePathParams";
import OrderStatuses from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";

class OrdersController {

    async getAll(req:Request<any, any,any, {client_id: number}>, res:Response, next:NextFunction) {
        if (req.user.role === UserRoles.customer) {
            const client = await Client.findOne({where: {user_id: req.user.id}});
            if (!client) {
                throw new Error('Client is not found. user.id:' + req.user.id);
            }
            const data = await ordersRepo.getOrdersWithPriceByClient(client.id);
            res.json(data);
        } else if (req.user.role === UserRoles.sales_manager) {
            const orders = await ordersRepo.getOrdersOfClients(req.user.id);
            res.send(orders);
        } else if(req.user.role === UserRoles.admin) {
            const orders = await ordersRepo.getOrdersOfClients(undefined, req.user.role);
            res.send(orders);
        } else {
            res.sendStatus(401);
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
        if (!req.body.newValue) {
            res.status(400).send({message: `Wrong new status`})
            return
        }
        const order = await Order.findOne({
            where: {
                id: req.params.orderId,
                client: {manager_id: req.user.id}
            },
            relations: ['client', 'client.contract']
        })
        if (order?.client.contract === null) {
            res.status(400).send({message: `client doesn't have contract`})
            return
        }
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

    @UseRole(UserRoles.sales_manager)
    @ParsePathParams([{param: 'orderId', type: 'number'}, {param: 'rowId', type: 'number'}])
    async updatePrice(req: Request<{rowId: number, orderId: number}>, res: Response, next: NextFunction) {
        await OrderByNomenclature.update({
            id: req.params.rowId,
            order: {
                id: req.params.orderId,
                client: {
                    manager_id: req.user.id
                }
            }
        }, {
            approved_price: req.body.newPrice
        })
        res.send(200);
    }
}

export default new OrdersController();