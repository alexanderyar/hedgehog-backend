import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
const { NotFound } = require("http-errors");

export const userEmailVerification: RequestHandler = async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new NotFound(" valid verification TOKEN has been NOT received");
  }
  const user = await User.findOneBy({ verificationToken });
  if (!user) {
    throw new NotFound("No such user in DB");
  }

  await User.update(user.id, {
    verificationToken: "",
    verifiedEmail: true,
  });

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });
};

// module.exports = userEmailVerification;
