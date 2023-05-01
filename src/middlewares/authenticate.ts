import { RequestHandler } from "express";
import { Unauthorized } from "http-errors";

const jwt = require("jsonwebtoken");

// пройслойка аутентификации. подкорректировать немного и будет ок наверное

const { SECRET_KEY } = process.env;

export const authenticate: RequestHandler = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new Unauthorized();
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    // const user = await User.findById(id);
    // будем тут юзера из базы забирать, но из нашей

    if (!user || !user.token.includes(token)) {
      throw new Unauthorized();
    }
    req.user = user;
    next();
  } catch {
    throw new Unauthorized();
  }
};

// module.exports = authenticate;
