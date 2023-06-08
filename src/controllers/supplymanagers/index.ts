import { RequestHandler } from "express";
import { NextFunction, Request, Response } from "express";

import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import ordersRepo from "../../repositories/Orders.repo";
import Order from "../../entity/Order.entity";
import UseRole from "../../decorators/UseRole";
import ParsePathParams from "../../decorators/ParsePathParams";
import OrderStatuses from "../../enums/OrderStatuses";
import OrderByNomenclature from "../../entity/OrderByNomenclature.entity";
import { User } from "../../entity/User.entity";
import Supplier from "../../entity/Suppliers.entity";
import { Unauthorized } from "http-errors";

class SupplyManagersController {
  @UseRole([UserRoles.supply_manager])
  async AddNewSup(req: Request, res: Response) {
    const data = await User.findOne({
      where: { id: req.user.id },
    });

    if (!data) {
      res.status(404).send("manager not found");
      return;
    }
    const new_sup_info = req.body;
    console.log(new_sup_info);

    //   0003CNYMS

    const result = Supplier.create({
      ...new_sup_info,
      manager_id: req.user.id,
      formatted_id: "xxx",
    });

    await result.save();

    const number = result!.id?.toString().padStart(4, "0");
    const name = result.company_name.substring(0, 3);
    const type = result.type.substring(0, 1);
    const formatted_id = `${number}${name}${type}S`;

    await Supplier.update(result!.id, {
      formatted_id: formatted_id.toUpperCase(),
    });

    res.status(201).json({
      message:
        "New Supplier Has Been Successfully Added. Thank you for you passion!",
    });
  }

  @UseRole([UserRoles.supply_manager])
  async getSupInfo(req: Request, res: Response) {
    const result = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!result) {
      throw new Unauthorized("Access denied");
    }

    const supinfo = await Supplier.find({
      where: { manager_id: req.user.id },
    });

    res.status(200).json({
      supinfo,
    });
  }
  @UseRole([UserRoles.supply_manager])
  @ParsePathParams([{ param: "supplier_id", type: "number" }])
  async editSup(req: Request<{ supplier_id: number }>, res: Response) {
    const { supplier_id } = req.params;
    const result = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!result) {
      throw new Unauthorized("Access denied");
    }
    const info_to_update = req.body;

    const data = await Supplier.findOne({
      where: { id: +info_to_update.id },
    });
    if (!data) {
      res.status(404).send("sup not found");
    }
    await Supplier.update(
      { id: +info_to_update.id },
      {
        ...info_to_update,
      }
    );
    res.status(200).send("Fields updated successfully");
  }

  @UseRole([UserRoles.supply_manager])
  @ParsePathParams([
    { param: "manager_id", type: "number" },
    { param: "supplier_id", type: "number" },
  ])
  async getSupById(req: Request<{ supplier_id: number }>, res: Response) {
    const { supplier_id } = req.params;

    const result = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    if (!result) {
      throw new Unauthorized("Access denied");
    }
    const sup = await Supplier.findOne({
      where: {
        id: +supplier_id,
        manager_id: req.user.id,
      },
    });
    if (!sup) {
      res.status(404).send("Supplier not found");
    }

    res.status(200).json({ sup });
  }
}
export default new SupplyManagersController();
