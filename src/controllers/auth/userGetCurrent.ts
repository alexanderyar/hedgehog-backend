import { RequestHandler } from "express";

export const userGetCurrent: RequestHandler = async (req, res) => {
  const { id, name, email, role, client_id } = req.user;

  res.json({ user: { id, login: name, email, role, client_id } });
};

// module.exports = getCurrent;
