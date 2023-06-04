import { NextFunction, Request, Response } from "express";
import { Unauthorized, Conflict, BadRequest } from "http-errors";

import { User } from "../entity/User.entity";
import { Session } from "../entity/Session.entity";
import jwt, { JwtPayload } from "jsonwebtoken";

const { SECRET_KEY } = process.env;

import Client from "../entity/Client.entity";
import UserRoles from "../enums/UserRoles";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new Unauthorized("Oops...Unauthorized");
  }

  try {
    const { id, email, name, role } = jwt.verify(
      token,
      SECRET_KEY
    ) as JwtPayload;

    const userVerification = await Session.findOne({
      where: { token: token },
    });
    if (!userVerification || !userVerification.token.includes(token)) {
      throw new Unauthorized("Unauthorized User");
    }

    /////!!!!!
    // const user = await User.findOneBy({ id: id });
    // reddis.find...... потом
    interface IUser {
      id: any;
      email: any;
      name: any;
      role: any;
      client_id?: number;
    }

    const user: IUser = { id, email, name, role };
    if (role === UserRoles.customer) {
      const client = await Client.findOne({
        where: { user_id: id },
      });
      user.client_id = client!.id;
    }

    req.user = user;

    next();
  } catch (err: any) {
    if (err.message === "jwt expired") {
      next(new Unauthorized("token expired"));
    } else next(new Conflict("regular authenticate err"));
  }
};
