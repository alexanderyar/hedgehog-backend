import Joi, { Schema } from "joi";
import userRoles from "../enums/UserRoles";

export const userRegistrationJoiSchema: Schema = Joi.object({
  login: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...Object.values(userRoles)),
  country: Joi.string().required(),
  telephone_number: Joi.string(),
});
// пока on hold
