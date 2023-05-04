const express = require("express");
const router = express.Router();

import ctrl from "../../controllers/auth/";

import { userRegistrationJoiSchema } from "../../models/user";

const { authenticate, validateBody } = require("../../middlewares");

router.post(
  "/register",
  validateBody(userRegistrationJoiSchema),
  ctrl.userRegistration
);

router.get("/verify/:verificationToken", ctrl.userEmailVerification);

router.post("/verify", ctrl.userResendVerificationEmail);

export default router;
