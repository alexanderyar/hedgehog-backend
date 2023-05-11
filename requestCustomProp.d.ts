// import { User } from "./src/entity/User.entity";

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}

interface IUser {
  name?: string;
  email?: string;
  id: number;
  role?: any;
  country?: string;
  telephone_number?: string;
}
