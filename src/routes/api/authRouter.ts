import express from "express";
const router = express.Router();

import ctrl from "../../controllers/auth/";

import { userRegistrationJoiSchema } from "../../models/user";

const { authenticate, validateBody } = require("../../middlewares");

router.post(
  "/register",
  // validateBody(userRegistrationJoiSchema),
  ctrl.userRegistration
);

router.get("/verify/:verificationToken", ctrl.userEmailVerification);

router.post("/verify", ctrl.userResendVerificationEmail);

// Joi validation is on hold until Kostya confirms
// router.post("/login", validateBody(schemasJoi.loginSchema), ctrl.login);
router.post("/login", ctrl.userLogin);

router.get("/current", authenticate, ctrl.userGetCurrent);

router.post("/refresh_token/", ctrl.userRefreshToken);

router.post("/logout", authenticate, ctrl.userLogout);

export default router;
