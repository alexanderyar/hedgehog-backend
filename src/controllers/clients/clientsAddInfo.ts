import { RequestHandler } from "express";
import Client from "../../entity/Client.entity";
import AppDataSource from "../../dataSource";

export const clientsAddInfo: RequestHandler = async (req, res) => {
  const info = req.body;

  console.log(info);

  const client_id = req.user.client_id;

  await AppDataSource.transaction(async (transactionEntityManager) => {
    ////////////////// this query is needed for country
    const client = await Client.findOne({ where: { user_id: req.user.id } });
    console.log(client);

    const country = client?.country.substring(0, 2);
    const number = client_id?.toString().padStart(4, "0");
    const company_name = info.companyName.substring(0, 3);
    const type = info.type.substring(0, 1);
    const formatted_id = `${country}${number}${company_name}${type}S`;

    ///////////////////

    await Client.update(client_id!, {
      address: info.address,
      company_name: info.companyName,
      ceo_name: info.ceoName,
      bank_info: info.bankInfo,
      bill_to: info.billTo,
      ship_to: info.shipTo,
      type: info.type,
      formatted_id: formatted_id.toUpperCase(),
    });
  });

  res.status(200).json({
    message: "Successfully updated",
    info,
  });
};
