import { NextFunction, Request, Response } from "express";
import { Unauthorized, Conflict, BadRequest } from "http-errors";

import { User } from "../entity/User.entity";
import { Session } from "../entity/Session.entity";
import jwt, {JwtPayload} from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

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
    const { id, email, name } = jwt.verify(token, SECRET_KEY) as JwtPayload;

    const userVerification = await Session.findOne({
      where: { token: token },
    });
    if (!userVerification || !userVerification.token.includes(token)) {
      throw new Unauthorized("Unauthorized User");
    }
    /////!!!!!
    // const user = await User.findOneBy({ id: id });
    // reddis.find...... потом

    // if (userVerification.user) {
    //   req.user = userVerification.user;
    // }
    const user = { id, email, name };
    req.user = user;
    // if (id) {

    //   req.user = { id };
    // }

    next();
  } catch (err: any) {
    // console.table(`authenticate catch: ${err.message}`);
    // next(new Conflict("Oops...token...."));
    if (err.message === "jwt expired") {
      next(new Unauthorized("token expired"));
    } else next(new Conflict("regular authenticate err"));
  }
};

// module.exports = authenticate;
