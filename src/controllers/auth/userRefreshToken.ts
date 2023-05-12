import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { Session } from "../../entity/Session.entity";
import { NotFound, BadRequest } from "http-errors";
import { tokenLoader } from "../../helpers/tokenLoader";
import { refreshTokenLoader } from "../../helpers/refreshTokenLoader";

// while importing using es6 syntax line 17 doesn't want to work at all;
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

  // const session = await Session.findOneBy({
  //   refresh_token,
  // });

  const session = await Session.findOne({
    where: { refresh_token },
    relations: ["user"],
  });

  if (!session) {
    throw new NotFound("No refresh token in DB");
  }

  const { email, login } = session.user;
  // const user = await User.findOneBy({
  //   id: id,
  // });
  // if (!user) {
  //   throw new NotFound("No such user in DB");
  // }

  const new_token = tokenLoader(id, email, login);
  // const new_payload = { id: id, email: email, name: login };
  // const new_token = jwt.sign(new_payload, process.env.SECRET_KEY, {
  //   expiresIn: "7d",
  // });

  const new_refresh_token = refreshTokenLoader(id);
  // const new_refresh_token_payload = { id: id };
  // const new_refresh_token = jwt.sign(
  //   new_refresh_token_payload,
  //   process.env.SECRET_KEY,
  //   {
  //     expiresIn: "20d",
  //   }
  // );

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
    },
  });
};
