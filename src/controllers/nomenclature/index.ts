import {NextFunction, Request, Response} from "express";
import paginated from "../../decorators/paginated";
import Nomenclature from "../../entity/Nomenclature.enity";
import StockBalance from "../../entity/StockBalance.entity";
import StockRepository from "../../repositories/StockBalance.repo";
import Replacement from "../../entity/Replacement";
import NomenclatureRepo from "../../repositories/Nomenclature.repo";
import Datasheet from "../../entity/Datasheet.entity";
import {UploadedFile} from "express-fileupload";
import {User} from "../../entity/User.entity";

class NomenclatureController {
    @paginated<Nomenclature>({entity: Nomenclature})
    async getAll(req:Request<null,null,null,{
        skip?: string,
        take?: string
    }>, res:Response, next:NextFunction, findOptions?:{
        skip: number,
        take: number
    }) {
        const data = await Nomenclature.find(findOptions)
        return data;
    }

    @paginated<StockBalance>({entity: StockBalance, countFunction: StockRepository.getGroupedCount.bind(StockRepository),})
    async getAvailable(req:Request<null,null,null,{
        skip?: string,
        take?: string
        number?: string
    }>, res:Response, next:NextFunction, findOptions:{
        skip: number,
        take: number,
        number?: string
    }) {
        const { skip, take, number } = findOptions;
        const data = await StockRepository.findGrouped(skip, take, number);
        return data;
    }

    @paginated<Replacement>({entity: Replacement, skipCount: true})
    async getReplacement(req: Request<{id: string}>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await StockRepository.findGrouped(undefined, undefined, undefined, id)
            return data;

        } catch (e) {
            res.status(400);
            res.send({message: 'Wrong nomenclature id'})
        }
    }

    async getDatasheet(req: Request<{id: string}>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await Datasheet.findOne({where: {nomenclature_id: id}})
            if (!data) {
                res.sendStatus(404);
                return
            }

            res.setHeader('Content-Length', data.file_buffer.length);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');

            res.send(data.file_buffer);
        } catch (e) {
            res.status(400);
            res.send({message: 'Wrong nomenclature id'})
        }
    }

    async saveDatasheet(req: Request<{id: string}>, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            try {
                if(!req.files || !req.files.file) {
                    res.status(400);
                    res.send('No files to upload');
                    return;
                }

                const data = await Datasheet.findOne({where: {nomenclature_id: id}});
                const file = req.files.file as any;

                if (file.mimetype !== 'application/pdf') {
                    res.status(400);
                    res.send('Wrong file type');
                    return;
                }
                if (data) {
                    data.file_name = file.name;
                    data.file = file.data;
                    await data.save();
                    res.sendStatus(200)
                    return;
                }

                const datasheet = Datasheet.create({
                    nomenclature_id: id,
                    file_name: file.name,
                    file: file.data
                });

                await datasheet.save();
                res.sendStatus(201);
            } catch (e) {
                res.status(400);
                res.send({message: 'Wrong nomenclature id'})
            }
        } catch (e) {
            res.status(400);
            res.send({message: 'Wrong nomenclature id'})
        }
    }
}

export default new NomenclatureController();