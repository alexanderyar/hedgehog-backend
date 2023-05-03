// import { RequestHandler } from "express";

// const { User } = require("../../models/user");
// const { NotFound } = require("http-errors");

// export const userEmailVerification: RequestHandler = async (req, res) => {
//   const { verificationToken } = req.params;
//   if (!verificationToken) {
//     throw new NotFound("verification TOKEN is not received");
//   }
//   const user = await User.findOne({ verificationToken });
//   if (!user) {
//     throw new NotFound("no such user in our database");
//   }
//   await User.findByIdAndUpdate(user._id, {
//     verificationToken: "",
//     verify: "true",
//   });

//   res.status(200).json({
//     status: "success",
//     code: 200,
//     data: {
//       message: "Verification successful",
//     },
//   });
// };

// // module.exports = userEmailVerification;
