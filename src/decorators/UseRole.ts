import {BaseEntity} from "typeorm";
import {NextFunction, Request, Response} from "express";
import userRoles from "../enums/UserRoles";
import UserRoles from "../enums/UserRoles";

/*: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void*/
export default function UseRole(params: userRoles | userRoles[])
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;
        const roles = Array.isArray(params) ? [...params, UserRoles.admin] : [params, UserRoles.admin];

        descriptor.value = async function (req:Request,res:Response,next:NextFunction) {
            const user = req.user;
            if (!user || !roles.some(role => user.role === role)) {
                next({
                    status: 401,
                });
                return;
            }
            await childFunction(req, res, next);
        }
        return descriptor;
    };
}