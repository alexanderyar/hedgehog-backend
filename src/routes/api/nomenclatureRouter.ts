import express, {NextFunction, Request, Response} from "express";
import nomenclature from "../../controllers/nomenclature";
import {ctrlWrapper} from "../../helpers";
const router = express.Router();

router.get('/',  ctrlWrapper((req:Request<null,null,null,{
    skip?: string,
    take?: string
}>, res:Response, next:NextFunction) => {
    nomenclature.getAll(req, res, next)
}));
router.get('/available',  ctrlWrapper((req:Request<null,null,null,{
    skip?: string,
    take?: string
}>, res:Response, next:NextFunction, findOptions: {
    skip: number,
    take: number
}) => {
    nomenclature.getAvailable(req, res, next, findOptions)
}));

export default router;