import { RequestHandler } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { User } from "../../entity/User.entity";
import { Unauthorized } from "http-errors";

const { SECRET_KEY } = process.env;

export const userLogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOneBy({ email });
  if (!user) throw new Unauthorized("User data is not valid");
  if (!user.verified_email) throw new Unauthorized("Email not verified");

  const comparePass = await bcrypt.compare(password, user.password);
  if (!comparePass) new Unauthorized("Email or password is wrong");

  const payload = { id: user.id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  // ts doesn't allow to perform .push on a string
  // user.token.push(token);
  user.token = token;

  await User.update(user.id, { token: user.token });
  res.json({
    token,
    user: {
      id: user.id,
      login: user.login,
      email: user.email,
    },
  });
};

// module.exports = login;
