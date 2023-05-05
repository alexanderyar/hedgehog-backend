import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
const { sendEmail } = require("../../helpers");
const { NotFound, BadRequest } = require("http-errors");
const { verifyMail } = require("../../helpers/emails");

export const userResendVerificationEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequest("missing valid email");

  const user = await User.findOneBy({ email });

  if (!user) throw new NotFound("User not found");

  if (user.verifiedEmail)
    throw new BadRequest("Verification has already been passed");

  const verifyEmail = {
    to: email,
    subject: "Resending email verification",
    html: verifyMail(user.verificationToken),
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

// module.exports = resendVerifyEmail;
