import { RequestHandler } from "express";

export const userGetCurrent: RequestHandler = async (req, res) => {
  const { id, name, email, role } = req.user;

  res.json({ user: { id, name, email, role } });
};

// module.exports = getCurrent;
