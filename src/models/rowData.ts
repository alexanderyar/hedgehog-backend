import Joi, { Schema } from "joi";
import userRoles from "../enums/UserRoles";

export const rowDataJoiSchema: Schema = Joi.object({
  balance: Joi.number().greater(0).required(),
  manufacture_date: Joi.string()
    .regex(/^\d+\+$/)
    .required(),
  nomenclature_id: Joi.number().required(),
  part_number: Joi.string().required(),
  reasons: Joi.array().items(Joi.string()).required(),
  supplier_id: Joi.number().required(),
  ignore: Joi.any().optional(),
  manufacturer: Joi.string().optional(),
  package: Joi.string().optional(),
  order_time: Joi.string().optional(),
  mpq: Joi.number().optional(),
  moq: Joi.number().optional(),
  price: Joi.number().optional(),
});
