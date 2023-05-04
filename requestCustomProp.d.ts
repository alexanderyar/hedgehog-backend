// import { User } from "./src/entity/User.entity";

declare namespace Express {
  export interface Request {
    user: IUser;
  }
}

interface IUser {
  login: string;
  email: string;
  id: number;
  // password?: string;
  role?: any;
}
