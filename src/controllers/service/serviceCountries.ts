import { RequestHandler } from "express";
import { countries } from "../../data/coutries";

export const serviceGetCountries: RequestHandler = async (req, res) => {
  res.status(200).json({ countries });
};
