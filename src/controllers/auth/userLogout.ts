import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";

export const userLogout: RequestHandler = async (req, res) => {
  const { id } = req.user;
  await User.update(id, { token: "" });
  res.status(204).json();
};

// module.exports = userLogout;
