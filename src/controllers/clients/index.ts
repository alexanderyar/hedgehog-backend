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
import OrderStatuses, {OrderStatusesMap} from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";
import ShipIfo from "../../entity/ShipIfo.entity";

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

    @UseRole([UserRoles.sales_manager, UserRoles.customer])
    @ParsePathParams([{param: 'id', type: 'number'}])
    async getClientShipDetails (req: Request<{id: number}>, res:Response, next: NextFunction) {
        if (req.user.role === UserRoles.customer) {
            if (req.user.client_id !== req.params.id) {
                res.send(401);
                return
            }
        }

        const shipInfo = await ShipIfo.find({where: { client_id: req.params.id}});
        res.send(shipInfo);
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
        let shipId = data.shipId;

        if (!data.cartData) {
            res.send(new BadRequest("cart data is not present"));
            return;
        }
        const client_id = req.user.client_id;

        const client = await Client.findOne({
            where: { id: client_id },
            relations: ['ship_infos']
        });

        if (!shipId) {
            if(client?.ship_infos.length === 1) {
                shipId = client?.ship_infos[0];
            } else {
                return res.status(400).send({message: 'wrong shipId'});
            }
        }

        const address = client!.address;
        const ceo_name = client!.ceo_name;
        const shipInfos = client!.ship_infos

        const info = [
            { address },
            { ceo_name },
        ];

        info.map((item) => {
            const value = Object.values(item)[0];
            const key = Object.keys(item)[0];
            if (value == null) {
                absent_info.push(key);
            }
        });

        if(shipInfos.length === 0) {
            absent_info.push('bank_info')
            absent_info.push('bill_to')
            absent_info.push('ship_to')
        } else {
            let hasBankInfo = false;
            let hasBillToInfo = false;
            let hasShipToInfo = false;

            shipInfos.forEach(info => {
                if (info.bank_info) {
                    hasBankInfo = true
                }
                if (info.bill_to) {
                    hasBillToInfo = true
                }
                if (info.ship_to) {
                    hasShipToInfo = true
                }
            })
            if (!hasBankInfo) {
                absent_info.push('bank_info')
            }
            if (!hasBillToInfo) {
                absent_info.push('bill_to')
            }
            if (!hasShipToInfo) {
                absent_info.push('ship_to')
            }
        }

        if (absent_info.length > 0) {
            return res.status(400).json({
                absent_info,
            });
        }

        await AppDataSource.transaction(async (transactionEntityManager) => {

            const result = Order.create({
                client_id: user.client_id,
                ship_id: shipId,
                // FIXME add comment text
                status: OrderStatusesMap.get(OrderStatuses.created),
            });
            await transactionEntityManager.save(result);


            const new_data = data.cartData.map((item: any) => {
                item.order_id = result.id;
                item.nomenclature_id = item.part_id;
                //// FIXME price hardcoded
                item.price = 666;
                return item;
            });

            await transactionEntityManager.createQueryBuilder()
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

        const client_id = req.user.client_id;

        if (info.address || info.ceoName) {
            await Client.update(client_id!, {
                address: info.address,
                ceo_name: info.ceoName,
            });
        }

        if (info.bankInfo || info.billTo || info.shipTo) {
            const shipInfo = ShipIfo.create({
                client_id,
                bank_info: info.bankInfo,
                bill_to: info.billTo,
                ship_to: info.shipTo
            })
            await shipInfo.save();
        }

        res.status(200).json({
            message: "Successfully updated",
            info,
        });
    }

}

export default new ClientsController();