import UserRoles from "../enums/UserRoles";

const jwt = require("jsonwebtoken");

interface ITokenLoader {
  id: number;
  email: string;
  name: string;
  role: UserRoles
}
export const tokenLoader = (id: number, email: string, name: string, role: UserRoles) => {
  const payload: ITokenLoader = { id, email, name, role };

  const token: string = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};
