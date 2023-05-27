import { RequestHandler } from "express";
import { User } from "../../entity/User.entity";
import { Session } from "../../entity/Session.entity";
import { NotFound } from "http-errors";
import { tokenLoader } from "../../helpers/tokenLoader";
import { refreshTokenLoader } from "../../helpers/refreshTokenLoader";

import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";

export const userEmailVerification: RequestHandler = async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new NotFound(" valid verification TOKEN has been NOT received");
  }
  const user = await User.findOneBy({ verification_token: verificationToken });

  if (!user) {
    throw new NotFound("No such user in DB");
  }

  await User.update(user.id, {
    verification_token: "",
    verified_email: true,
  });

  // sucessful verification gives the user TOKEN so he doesn't need to LOGIN once again
  const token = tokenLoader(user.id, user.email, user.login, user.role);

  // const payload = { id: user.id, email: user.email, name: user.login };
  // const token: string = jwt.sign(payload, process.env.SECRET_KEY, {
  //   expiresIn: "7d",
  // });

  const refresh_token = refreshTokenLoader(user.id);
  // const refresh_token_payload = { id: user.id };
  // const refresh_token = jwt.sign(
  //   refresh_token_payload,
  //   process.env.SECRET_KEY,
  //   {
  //     expiresIn: "20d",
  //   }
  // );

  // user.token = token;
  // user.refresh_token = refresh_token;

  // await User.update(user.id, { token: user.token });

  const result = await Session.create({
    token: token,
    refresh_token: refresh_token,
    user,
  });

  await result.save();

  // res.status(200).json({
  //   status: "success",
  //   code: 200,
  //   data: {
  //     message: "Verification successful",
  //   },
  // });

  // when we have front-end, we'll use this approach

  /////////// FIXME костыль
  // add client_id if the user IS customer
  if (user.role === UserRoles.customer) {
    const client = await Client.findOne({
      where: { user_id: user.id },
    });

    const client_id = client?.id;

    res.redirect(
      `${process.env.FRONTEND_URL}?token=${token}&refresh_token=${refresh_token}&id=${user.id}&name=${user.login}&email=${user.email}&role=${user.role}&client_id=${client_id}`
    );
  } else {
    res.redirect(
      `${process.env.FRONTEND_URL}?token=${token}&refresh_token=${refresh_token}&id=${user.id}&name=${user.login}&email=${user.email}&role=${user.role}`
    );
  }
};
// &client_id=${client_id}

// module.exports = userEmailVerification;
