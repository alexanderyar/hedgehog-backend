import {NextFunction, Request, Response} from "express";
import ordersRepo from "../../repositories/Orders.repo";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";

export default async function getAll(req:Request, res:Response, next:NextFunction) {
    if (req.user.role === UserRoles.customer) {
        const client = await Client.findOne({where: {user_id: req.user.id}});
        if (!client) {
            throw new Error('Client is not found. user.id:' + req.user.id);
        }
        const data = await ordersRepo.getOrdersWithPriceByClient(client.id);
        res.json(data);
    }

}