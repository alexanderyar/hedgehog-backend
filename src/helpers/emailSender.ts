const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (data: EmailData) => {
  const email = { ...data, from: "alexanderyaretskiy@gmail.com" };
  await sgMail.send(email);
  return true;
};

// module.exports = sendEmail;
