/// <reference path="../../../requestCustomProp.d.ts" />
import { RequestHandler } from "express";

export const userGetCurrent: RequestHandler = async (req, res) => {
  const { id, name, email } = req.user;

  res.json({ user: { id, name, email } });
};

// module.exports = getCurrent;
