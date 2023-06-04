import {NextFunction, Request, Response} from "express";
import UseRole from "../../decorators/UseRole";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import ParsePathParams from "../../decorators/ParsePathParams";
import Contract from "../../entity/Contract.entity";
import ClientsRepo from "../../repositories/Clients.repo";
import Datasheet from "../../entity/Datasheet.entity";
import {User} from "../../entity/User.entity";
import {BadRequest} from "http-errors";
import AppDataSource from "../../dataSource";
import Order from "../../entity/Order.entity";
import OrderStatuses from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";

// @ts-ignore
class ClientsController {
    @UseRole(UserRoles.sales_manager)
    async getAllClients(req: Request, res:Response, next: NextFunction) {
        const clients = await Client.find({
            where: {manager_id: req.user.id},
            relations: ['orders']
        });
        res.json(clients)
    }
    @UseRole([UserRoles.sales_manager, UserRoles.customer])
    @ParsePathParams([{param: 'id', type: 'number'}])
    async getClientDetails (req: Request<{id: number}>, res:Response, next: NextFunction) {
        let id;
        if (req.user.role === UserRoles.customer) {
            const client = await Client.findOne({where: {user_id: req.user.id}});
            if (!client) {
                res.sendStatus(401);
                return;
            }
            id = client.id;
        } else {
            id = req.params.id;
        }
        const client = await ClientsRepo.getClientWithContractId(id)

        res.json(client[0])
    }

    @UseRole(UserRoles.sales_manager)
    @ParsePathParams([{param: 'id', type: 'number'}])
    async uploadContract (req: Request<{id: number}>, res:Response, next: NextFunction) {
        const file = req.files!.file as any;
        if (!file) {
            res.status(400);
            res.send({message: 'file not find'});
            return;
        }
        if (file.mimetype !== 'application/pdf') {
            res.status(400);
            res.send('Wrong file type');
            return;
        }
        const id = req.params.id;
        const data = await Contract.findOne({where: {client_id: id}});
        if (data) {
            data.file_name = file.name;
            data.file = file.data;
            await data.save();
            res.sendStatus(200)
            return;
        }
        const datasheet = Contract.create({
            client_id: req.params.id,
            file_name: file.name,
            file: file.data
        });

        await datasheet.save();
        res.sendStatus(201);
    }
    @UseRole([UserRoles.sales_manager, UserRoles.customer])
    @ParsePathParams([{param: 'clientId', type: 'number'},{param: 'contractId', type: 'number'}])
    async getContract (req: Request<{clientId: number, contractId: number}>, res:Response, next: NextFunction) {
        const data = await Contract.findOne({where: {client_id: req.params.clientId, id: req.params.contractId}})
        if (!data) {
            res.sendStatus(404);
            return
        }

        res.setHeader('Content-Length', data.file_buffer.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');

        res.send(data.file_buffer);
    }

    async clientsCreateOrder (req: Request, res:Response, next: NextFunction) {
        let absent_info: any = [];
        const user = req.user;
        const data = req.body;
        console.log(data);
        if (!data) {
            throw new BadRequest("cart data is not present");
        }
        const client_id = req.user.client_id;

        const client = await Client.findOneBy({ id: client_id });

        const address = client!.address;
        const ceo_name = client!.ceo_name;
        const bank_info = client!.bank_info;
        const bill_to = client!.bill_to;
        const ship_to = client!.ship_to;

        const info = [
            { address },
            { ceo_name },
            { bank_info },
            { bill_to },
            { ship_to },
        ];

        info.map((item) => {
            const value = Object.values(item)[0];
            const key = Object.keys(item)[0];
            if (value == null) {
                absent_info.push(key);
            }
        });

        if (absent_info.length > 0) {
            res.status(400).json({
                absent_info,
            });
        }

        ////// order
        //   const result = Order.create({
        // client_id: user.client_id,
        // FIXME status field can't be default
        // FIXME add comment text
        // QueryFailedError: null value in column "status" of relation "orders" violates not-null constraint
        //     status: OrderStatuses.created,
        //   });

        //   await result.save();

        //   const new_data = data.map((item: any) => {
        //     item.order_id = result.id;
        //     item.nomenclature_id = item.part_number;
        //     //// FIXME price hardcoded
        //     item.price = 666;
        //     return item;
        //   });

        //   const by_nomenclature_result = await OrderByNomenclature.createQueryBuilder()
        //     .insert()
        //     .into(OrderByNomenclature)
        //     .values(new_data)
        //     .execute();

        await AppDataSource.transaction(async (transactionEntityManager) => {
            const result = Order.create({
                client_id: user.client_id,
                // FIXME status field can't be default
                // FIXME add comment text
                // QueryFailedError: null value in column "status" of relation "orders" violates not-null constraint
                status: OrderStatuses.created,
            });
            await result.save();

            const new_data = data.map((item: any) => {
                item.order_id = result.id;
                item.nomenclature_id = item.part_number;
                //// FIXME price hardcoded
                item.price = 666;
                return item;
            });

            await OrderByNomenclature.createQueryBuilder()
                .insert()
                .into(OrderByNomenclature)
                .values(new_data)
                .execute();
        });

        res.status(204).json({
            message: "the order has been submitted successfully ",
        });
    }
    async clientsAddInfo (req: Request<{clientId: number, contractId: number}>, res:Response, next: NextFunction) {
        const info = req.body;

        console.log(info);

        const client_id = req.user.client_id;

        await Client.update(client_id!, {
            address: info.address,
            ceo_name: info.ceoName,
            bank_info: info.bankInfo,
            bill_to: info.billTo,
            ship_to: info.shipTo,
        });

        res.status(200).json({
            message: "Successfully updated",
            info,
        });
    }

}

export default new ClientsController();