import {NextFunction, Request, Response} from "express";
import getAllSuppliers from "../../services/suppliersService";

export default async function suppliersGetAll (req:Request, res:Response, next:NextFunction) {
    const allSuppliers = await getAllSuppliers();

    res.json(allSuppliers);
}