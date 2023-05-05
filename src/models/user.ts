import Joi, { Schema } from "joi";
import { userRole } from "../entity/User.entity";

export const userRegistrationJoiSchema: Schema = Joi.object({
  login: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...Object.values(userRole)),
});
// пока on hold
