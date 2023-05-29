import {NextFunction, Request, Response} from "express";

export interface ParsePathParamsInterface {
    param: string,
    type: 'number' //What else could be in path params??? In theory, we could have such case
}

/*: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void*/
export default function ParsePathParams(params: ParsePathParamsInterface[])
{
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const childFunction = descriptor.value;


        descriptor.value = async function (req:Request<Record<string, any>>,res:Response,next:NextFunction) {
            for(let i=0; i < params.length; i++) {
                let param = params[i];
                if(req.params[param.param] !== undefined) {

                    if(param.type === 'number') {
                        const parsed = parseInt(req.params[param.param]);
                        if(isNaN(parsed)) {
                            res.status(400);
                            res.send({message: `Wrong ${param.param} value`});
                            return;
                        }
                        req.params[param.param] = parsed
                    }
                }
            }

            await childFunction(req, res, next);
        }
        return descriptor;
    };
}