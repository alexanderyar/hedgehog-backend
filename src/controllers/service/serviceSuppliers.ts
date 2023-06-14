import { RequestHandler } from "express";
import SupplierRepo from "../../repositories/Supplier.repo";
import UserRoles from "../../enums/UserRoles";
import { User } from "../../entity/User.entity";

export const serviceGetSuppliers: RequestHandler = async (req, res) => {
  if (req.user.role !== UserRoles.supply_manager) {
    res.status(403).send("Access denied");
  }
  const manager = await User.findOne({
    where: { id: req.user.id },
  });
  if (!manager) {
    throw new Error("Manager is not found. user.id:" + req.user.id);
  }
  const data = await SupplierRepo.getFormattedIds(req.user.id);
  const formatted_data = data.map((obj: any) => obj.formatted_id);
  console.log(JSON.stringify(formatted_data));
  res.status(200).json({ formatted_data });
};
