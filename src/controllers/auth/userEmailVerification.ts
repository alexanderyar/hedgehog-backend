import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
const jwt = require("jsonwebtoken");
const { NotFound } = require("http-errors");

export const userEmailVerification: RequestHandler = async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new NotFound(" valid verification TOKEN has been NOT received");
  }
  const user = await User.findOneBy({ verification_token: verificationToken });
  if (!user) {
    throw new NotFound("No such user in DB");
  }

  await User.update(user.id, {
    verification_token: "",
    verified_email: true,
  });

  // sucessful verification gives the user TOKEN so he doesn't need to LOGIN once again
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  // это ок? прямое присваивание?
  user.token = token;

  await User.update(user.id, { token: user.token });

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });

  // when we have front-end, we'll use this approach
  //   res.redirect(
  //     `${process.env.FRONTEND_URL}?token=${token}&id=${user.id}&login=${user.login}&email=${user.email}`
  //   );
};

// module.exports = userEmailVerification;
