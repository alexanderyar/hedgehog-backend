import { RequestHandler } from "express";
import UserRoles from "../../enums/UserRoles";
import Supplier from "../../entity/Suppliers.entity";
import { User } from "../../entity/User.entity";
import { Unauthorized } from "http-errors";
import { stringify } from "querystring";

export const getSupInfo: RequestHandler = async (req, res) => {
  const { buyer_id } = req.params;
  console.log(buyer_id);
  const result = await User.findOne({
    where: {
      id: +buyer_id,
    },
  });
  if (
    +buyer_id !== req.user.id ||
    !result ||
    req.user.role !== UserRoles.supply_manager
  ) {
    throw new Unauthorized("Access denied");
  }

  ///// since manager_id is a user id with role "supply_manager"
  const supinfo = await Supplier.find({ where: { manager_id: +buyer_id } });
  //   console.log(JSON.stringify(supinfo));

  res.status(200).json({
    supinfo,
  });
};
