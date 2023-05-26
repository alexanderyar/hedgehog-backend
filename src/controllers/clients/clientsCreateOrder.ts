import { RequestHandler } from "express";
import { BadRequest } from "http-errors";
import Client from "../../entity/Client.entity";
import Order from "../../entity/Order.entity";
import OrderStatuses from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";

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
  const ceo_name = client!.ceo_name;
  const bank_info = client!.bank_info;
  const bill_to = client!.bill_to;
  const ship_to = client!.ship_to;

  const info = [
    { address },
    { ceo_name },
    { bank_info },
    { bill_to },
    { ship_to },
  ];

  info.map((item) => {
    const value = Object.values(item)[0];
    const key = Object.keys(item)[0];
    if (value == null) {
      absent_info.push(key);
    }
  });

  console.log(absent_info);

  if (absent_info.length > 0) {
    res.status(400).json({
      absent_info,
    });
  }

  ////// order
  const result = await Order.create({
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

  //   console.log("new data" + JSON.stringify(new_data));
  /// order by nom
  const by_nomenclature_result = await OrderByNomenclature.createQueryBuilder()
    .insert()
    .into(OrderByNomenclature)
    .values(new_data)
    .execute();

  res.status(204).json({
    message: "the order has been submitted successfully ",
  });
};
