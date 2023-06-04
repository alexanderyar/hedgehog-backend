import { RequestHandler } from "express";
import Client from "../../entity/Client.entity";

export const clientsAddInfo: RequestHandler = async (req, res) => {
  const info = req.body;

  console.log(info);

  const client_id = req.user.client_id;

  await Client.update(client_id!, {
    address: info.address,
    ceo_name: info.ceoName,
    bank_info: info.bankInfo,
    bill_to: info.billTo,
    ship_to: info.shipTo,
  });

  res.status(200).json({
    message: "Successfully updated",
    info,
  });
};
