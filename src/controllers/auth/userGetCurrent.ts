/// <reference path="../../../requestCustomProp.d.ts" />
import { RequestHandler } from "express";

export const userGetCurrent: RequestHandler = async (req, res) => {
  const { id, login, email } = req.user;
  res.json({ id, login, email });
};

// module.exports = getCurrent;
