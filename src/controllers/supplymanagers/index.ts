import {Request, Response} from "express";

import UserRoles from "../../enums/UserRoles";
import UseRole from "../../decorators/UseRole";
import ParsePathParams from "../../decorators/ParsePathParams";
import {User} from "../../entity/User.entity";
import Supplier from "../../entity/Suppliers.entity";
import SupplierRepo from "../../repositories/Supplier.repo";

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
    const whereOption = req.user.role === UserRoles.admin ? {} : { manager_id: req.user.id }
    const supInfo = await Supplier.find({
      where: whereOption,
    });

    res.status(200).json(supInfo);
  }

  @UseRole([UserRoles.supply_manager])
  @ParsePathParams([{ param: "supplier_id", type: "number" }])
  async editSup(req: Request<{ supplier_id: number }>, res: Response) {
    const { supplier_id } = req.params;
    const info_to_update = req.body;

    if (req.user.role !== UserRoles) {
      if (supplier_id !== info_to_update.id) {
        return res.sendStatus(401);
      }
    }


    const data = await Supplier.findOne({
      where: { id: info_to_update.id },
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
    const where = req.user.role === UserRoles.admin ? {} : {
      manager_id: req.user.id,
    }

    const sup = await Supplier.findOne({
      where: {
        id: supplier_id,
        ...where
      },
    });
    if (!sup) {
      res.status(404).send("Supplier not found");
    }

    res.status(200).json({ sup });
  }

  @UseRole([UserRoles.supply_manager])
  async getSuppliers (req: Request, res:Response) {

    const where = req.user.role === UserRoles.admin ? {} : {
      manager_id: req.user.id,
    }

    const data = await Supplier.find({
      where
    })
    const formatted_data = data.map((obj: any) => obj.formatted_id);
    res.status(200).json(formatted_data);
  }
}
export default new SupplyManagersController();
