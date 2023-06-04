import {NextFunction, Request, Response} from "express";
import UseRole from "../../decorators/UseRole";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import ParsePathParams from "../../decorators/ParsePathParams";
import Contract from "../../entity/Contract.entity";
import ClientsRepo from "../../repositories/Clients.repo";
import Datasheet from "../../entity/Datasheet.entity";
import {User} from "../../entity/User.entity";

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

    async clientsCreateOrder () => {}
    async clientsAddInfo () => {}

}

export default new ClientsController();