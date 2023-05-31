import { RequestHandler } from "express";
import { BadRequest } from "http-errors";
import Client from "../../entity/Client.entity";
import Order from "../../entity/Order.entity";
import OrderStatuses from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";
import AppDataSource from "../../dataSource";

export const clientsCreateOrder: RequestHandler = async (req, res) => {
  let absent_info: any = [];
  const user = req.user;
  const data = req.body;
  console.log(data);
  if (!data) {
    throw new BadRequest("cart data is not present");
  }
  const client_id = req.user.client_id;

  const client = await Client.findOneBy({ id: client_id });

  const address = client!.address;
  const company_name = client!.company_name;
  const ceo_name = client!.ceo_name;
  const bank_info = client!.bank_info;
  const bill_to = client!.bill_to;
  const ship_to = client!.ship_to;
  const type = client!.ship_to;

  const info = [
    { address },
    { company_name },
    { ceo_name },
    { bank_info },
    { bill_to },
    { ship_to },
    { type },
  ];

  info.map((item) => {
    const value = Object.values(item)[0];
    const key = Object.keys(item)[0];
    if (value == null) {
      absent_info.push(key);
    }
  });

  if (absent_info.length > 0) {
    return res.status(400).json({
      absent_info,
    });
  }

  ////// order
  //   const result = Order.create({
  // client_id: user.client_id,
  // FIXME status field can't be default
  // FIXME add comment text
  // QueryFailedError: null value in column "status" of relation "orders" violates not-null constraint
  //     status: OrderStatuses.created,
  //   });

  //   await result.save();

  //   const new_data = data.map((item: any) => {
  //     item.order_id = result.id;
  //     item.nomenclature_id = item.part_number;
  //     //// FIXME price hardcoded
  //     item.price = 666;
  //     return item;
  //   });

  //   const by_nomenclature_result = await OrderByNomenclature.createQueryBuilder()
  //     .insert()
  //     .into(OrderByNomenclature)
  //     .values(new_data)
  //     .execute();

  await AppDataSource.transaction(async (transactionEntityManager) => {
    const result = Order.create({
      client_id: user.client_id,
      // FIXME status field can't be default
      // FIXME add comment text
      // QueryFailedError: null value in column "status" of relation "orders" violates not-null constraint
      status: OrderStatuses.created,
    });
    await result.save();

    const new_data = data.map((item: any) => {
      item.order_id = result.id;
      item.nomenclature_id = item.part_number;
      //// FIXME price hardcoded
      item.price = 666;
      return item;
    });

    await OrderByNomenclature.createQueryBuilder()
      .insert()
      .into(OrderByNomenclature)
      .values(new_data)
      .execute();
  });

  res.status(204).json({
    message: "the order has been submitted successfully ",
  });
};
