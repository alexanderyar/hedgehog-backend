const jwt = require("jsonwebtoken");

interface IRefreshTokenLoader {
  id: number;
}
export const refreshTokenLoader = (id: number) => {
  const payload: IRefreshTokenLoader = { id };

  const refresh_token: string = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "20d",
  });
  return refresh_token;
};
