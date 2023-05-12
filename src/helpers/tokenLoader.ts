const jwt = require("jsonwebtoken");

interface ITokenLoader {
  id: number;
  email: string;
  name: string;
}
export const tokenLoader = (id: number, email: string, name: string) => {
  const payload: ITokenLoader = { id, email, name };

  const token: string = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};
