/// <reference path="../../requestCustomProp.d.ts" />
import { NextFunction, Request, Response } from "express";
import { Unauthorized } from "http-errors";

import { User } from "../entity/User.entity";
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new Unauthorized("Unauthorized");
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findOneBy({ id: id });
    // reddis.find...... потом

    if (!user || !user.token.includes(token)) {
      throw new Unauthorized("Unauthorized");
    }
    req.user = user;
    next();
  } catch {
    throw new Unauthorized("Unauthorized :(");
  }
};

// module.exports = authenticate;
