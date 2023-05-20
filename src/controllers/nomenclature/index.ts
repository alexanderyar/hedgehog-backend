import getAll from "./getAll";
import {ctrlWrapper} from "../../helpers";
import {NextFunction, Request, Response} from "express";
import paginated from "../../decorators/paginated";
import Nomenclature from "../../entity/Nomenclature.enity";
import StockBalance from "../../entity/StockBalance.entity";
import StockRepository from "../../repositories/StockBalance.repo";
import Replacement from "../../entity/Replacement";
import NomenclatureRepo from "../../repositories/Nomenclature.repo";
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
        // const count = await StockRepository.getGroupedCount();

        // res.json({
        //     data,
        //     count,
        //     ...findOptions
        // })
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
        // const count = await StockRepository.getGroupedCount();

        // res.json({
        //     data,
        //     count,
        //     ...findOptions
        // })
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


}

export default new NomenclatureController();