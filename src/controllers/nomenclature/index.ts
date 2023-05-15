import getAll from "./getAll";
import {ctrlWrapper} from "../../helpers";
import {NextFunction, Request, Response} from "express";
import paginated from "../../decorators/paginated";
import Nomenclature from "../../entity/Nomenclature.enity";
import StockBalance from "../../entity/StockBalance.entity";
import StockRepository from "../../repositories/StockBalance.repo";
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


}

export default new NomenclatureController();