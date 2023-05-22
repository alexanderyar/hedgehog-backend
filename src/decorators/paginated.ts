import {BaseEntity} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {type} from "os";

export class PaginationError{
    name = 'Pagination Error';
    message = 'Missing params skip or take';
}

type Entity<T> = {
    new (): T;
} & typeof BaseEntity
type PaginatedWithCount<T> = {
    entity: Entity<T>
    countFunction?: () => Promise<number>;
    skipCount?: boolean
}
export default function paginated<T extends BaseEntity>(params: PaginatedWithCount<T>): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;
        descriptor.value = async function (req:Request<null,null,null,{
            skip: string,
            take: string
        }>,res:Response,next:NextFunction) {
            const { query } = req;
            if (!query.skip || !query.take) {
                res.status(400);
                res.json(new PaginationError())
                return;
            }

            const findOptions: {
                skip: number,
                take: number,
                [k:string]: any
            } = {
                ...query,
                skip: parseInt(query.skip),
                take: parseInt(query.take)
            };
            const data = await childFunction.apply(this, [req,res,next, findOptions]);
            let count;
            if (params.skipCount) {
                count = data.length;
            } else if (params.countFunction) {
                count = await params.countFunction();
            } else {
                count = await params.entity.count();
            }
            return res.json({
                data,
                count,
                ...findOptions
            });
        };
        return descriptor;
    };
}