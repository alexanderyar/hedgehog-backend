import {User} from "../src/entity/User.entity";
import {Client} from "../src/entity/Client.entity";
// now you can import

export {};

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRET_KEY: string;
        }
    }
}

interface IUser {
    name?: string;
    email?: string;
    id: number;
    role?: any;
    country?: string;
    telephone_number?: string;
    client?: Client;
}