import { NextFunction, Request, Response } from "express";
import { Unauthorized, Conflict, BadRequest } from "http-errors";

import { User } from "../entity/User.entity";
import { Session } from "../entity/Session.entity";

import UserRoles from "../enums/UserRoles";
import Client from "../entity/Client.entity";

export const orderAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if this POST goes NOT from current user - no access
  try {
    const { clientId } = req.params;
    const { id } = req.user;
    const client = await Client.findOne({
      where: { user_id: id },
    });

    if (+clientId !== client!.id) {
      throw new Unauthorized("Not the order owner");
    }

    // later add if() check whether this user has a 'manager' role

    /// ?? why? xz
    // const user = await User.findOneBy({ id: req.user.id });

    next();
  } catch (err: any) {
    next(err);
  }
};
