import {NextFunction, Request, Response} from "express";
import Order from "../../entity/Order.entity";

export default async function getDetails(req:Request, res:Response, next:NextFunction) {
    try {
        const id = parseInt(req.params.id);
        const order = await Order.findOne({
            where: {id},
            relations: ['nomenclatures', 'nomenclatures.nomenclature']
        })
        res.send(order)

    } catch (e) {
        res.status(400)
        res.send('wrong orderId')
        return
    }
}