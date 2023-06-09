import { RequestHandler } from "express";
export const ctrlWrapper = (ctrl: Function) => {
  const func: RequestHandler = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  return func;
};

// module.exports = ctrlWrapper;
