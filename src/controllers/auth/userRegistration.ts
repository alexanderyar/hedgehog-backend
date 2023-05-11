import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { uuid } from "uuidv4";
import { verifyMail } from "../../helpers/emails";
const bcrypt = require("bcrypt");

const { BASE_URL } = process.env;

const { sendEmail } = require("../../helpers");

const { BadRequest, Conflict } = require("http-errors");

export const userRegistration: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOneBy({ email: email });

  if (user) {
    throw new Conflict("Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken: string = uuid();

  const result = await User.create({
    ...req.body,
    // overriding password from req.user with hashedPassword
    password: hashedPassword,
    verification_token: verificationToken,
  });

  await result.save();

  const verificationEmail = {
    to: email,
    subject: "Verify your email in order to use your profile",
    html: verifyMail(verificationToken),
  };

  await sendEmail(verificationEmail);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      login: result.login,
      email: result.email,
    },
  });
};

// module.exports = userRegistration
