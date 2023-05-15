import { RequestHandler } from "express";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");
import { User } from "../../entity/User.entity";
import { Session } from "../../entity/Session.entity";
import { Unauthorized } from "http-errors";
import { tokenLoader } from "../../helpers/tokenLoader";
import { refreshTokenLoader } from "../../helpers/refreshTokenLoader";

const { SECRET_KEY } = process.env;

export const userLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOneBy({ email });
  if (!user) throw new Unauthorized("User data is not valid");
  if (!user.verified_email) throw new Unauthorized("Email not verified");

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) new Unauthorized("Email or password is wrong");

  const token = tokenLoader(user.id, user.email, user.login, user.role);
  // const payload = { id: user.id, email: user.email, name: user.login };
  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  const refresh_token = refreshTokenLoader(user.id);
  // const refresh_token_payload = { id: user.id };
  // const refresh_token = jwt.sign(refresh_token_payload, SECRET_KEY, {
  //   expiresIn: "20d",
  // });

  // user.token = token;
  // user.refresh_token = refresh_token;

  // await User.update(user.id, { token: user.token });

  const result = await Session.create({
    token: token,
    refresh_token: refresh_token,
    user,
  });

  res.json({
    token,
    refresh_token,
    user: {
      id: user.id,
      login: user.login,
      email: user.email,
    },
  });

  await result.save();
};

// module.exports = login;
