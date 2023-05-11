import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { Session } from "../../entity/Session.entity";
const { NotFound } = require("http-errors");

const jwt = require("jsonwebtoken");
export const userRefreshToken: RequestHandler = async (req, res) => {
  const { refresh_token } = req.body;
  console.log(`refresh_token is ----- ${refresh_token}`);
  if (!refresh_token) {
    throw new NotFound(" valid verification TOKEN has been NOT received");
  }

  const { id } = jwt.verify(refresh_token, process.env.SECRET_KEY);
  console.log(`id is ----- ${id}`);
  const session = await Session.findOneBy({
    refresh_token,
  });
  console.log(`session is ${JSON.stringify(session)}`);
  if (!session) {
    throw new NotFound("No refresh token in DB");
  }
  const user = await User.findOneBy({
    id: id,
  });
  console.log(`user is ${JSON.stringify(user)}`);
  if (!user) {
    throw new NotFound("No such user in DB");
  }
  const new_payload = { id: user.id, email: user.email, name: user.login };
  const new_token = jwt.sign(new_payload, process.env.SECRET_KEY, {
    expiresIn: "2s",
  });

  const new_refresh_token_payload = { id: user.id };
  const new_refresh_token = jwt.sign(
    new_refresh_token_payload,
    process.env.SECRET_KEY,
    {
      expiresIn: "20d",
    }
  );
  console.log(`new token is - ${new_token}`);
  console.log(`new ref_token is - ${new_refresh_token}`);
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
      id: user.id,
      login: user.login,
      email: user.email,
    },
  });
};
