import { RequestHandler } from "express";
import { Session } from "../../entity/Session.entity";
import { NotFound, BadRequest } from "http-errors";
import { tokenLoader } from "../../helpers/tokenLoader";
import { refreshTokenLoader } from "../../helpers/refreshTokenLoader";

import jwt, {JwtPayload} from "jsonwebtoken";

export const userRefreshToken: RequestHandler = async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new NotFound(" valid verification TOKEN has been NOT received");
  }

  const { id } = jwt.verify(refresh_token, process.env.SECRET_KEY) as JwtPayload;

  if (!id) {
    throw new BadRequest("refresh token has been expired. Please log in");
  }

  const session = await Session.findOne({
    where: { refresh_token },
    relations: ["user"],
  });

  if (!session) {
    throw new NotFound("No refresh token in DB");
  }

  const { email, login, role } = session.user;

  const new_token = tokenLoader(id, email, login, role);
  const new_refresh_token = refreshTokenLoader(id);


  await Session.update(
    { refresh_token: refresh_token },
    {
      token: new_token,
      refresh_token: new_refresh_token,
    }
  );

  res.json({
    token: new_token,
    refresh_token: new_refresh_token,
    user: {
      id: id,
      login: login,
      email: email,
      role
    },
  });
};
