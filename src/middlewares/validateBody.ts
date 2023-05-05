import { RequestHandler } from "express";
import { BadRequest } from "http-errors";
import { Schema } from "joi";

export const validateBody = (schema: Schema) => {
  const func: RequestHandler = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new BadRequest("Oops, bad request");
    }
    next();
  };
  return func;
};

// module.exports = validateBody;
