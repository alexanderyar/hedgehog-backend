import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { Session } from "../../entity/Session.entity";
import { BadRequest } from "http-errors";

export const userLogout: RequestHandler = async (req, res) => {
  // не нужен
  // const { id } = req.user;

  // достаем токен, чтобы не удалить первый попавшийся по юзеру
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  // await User.update(id, { token: "" });

  // deleting token entry
  const deleteResult = await Session.delete({ token: token });
  if (deleteResult.affected === 1) {
    res.status(204).json();
  } else {
    throw new BadRequest();
  }
};

// module.exports = userLogout;
