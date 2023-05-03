// import { RequestHandler } from "express";

// const { BASE_URL } = process.env;
// const { BadRequest } = require("http-errors");
// const { sendEmail } = require("../../helpers");
// const { User } = require("../../models/user");

// export const userResendVerificationEmail: RequestHandler = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     throw new BadRequest("missing required email field");
//   }
//   const user = User.findOne({ email });
//   if (user.verify === "true") {
//     throw new BadRequest("this email has been already verified");
//   }
//   const verificationToken = user.verificationToken;
//   const verificationEmail = {
//     to: email,
//     subject: "Verify your email in order to use your profile",
//     html: `<a target="_blank" href="${BASE_URL}/users//verify/${verificationToken}">Click to verify your email</a>`,
//   };

//   await sendEmail(verificationEmail);
//   res.status(200).json({
//     status: "success",
//     code: 200,
//     data: {
//       message: "Verification email sent AGAIN",
//     },
//   });
// };

// // module.exports = userResendVerificationEmail
