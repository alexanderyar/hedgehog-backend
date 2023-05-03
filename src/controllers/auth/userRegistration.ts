import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { uuid } from "uuidv4";
const bcrypt = require("bcrypt");

const { BASE_URL } = process.env;
// import { nanoid } from "nanoid";
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

  ///// !!!!!
  const result = await User.create({
    ...req.body,
    // overriding password from req.user with hashedPassword
    password: hashedPassword,
    verificationToken: verificationToken,
  });

  await result.save();

  const verificationEmail = {
    to: email,
    subject: "Verify your email in order to use your profile",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
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
