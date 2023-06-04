import { NextFunction, Request, Response } from "express";
import ordersRepo from "../../repositories/Orders.repo";
import UserRoles from "../../enums/UserRoles";
import Client from "../../entity/Client.entity";
import { User } from "../../entity/User.entity";

export default async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user.role === UserRoles.customer) {
    const client = await Client.findOne({ where: { user_id: req.user.id } });
    if (!client) {
      throw new Error("Client is not found. user.id:" + req.user.id);
    }
    const data = await ordersRepo.getOrdersWithPriceByClient(client.id);
    res.json(data);
  }
  if (req.user.role === UserRoles.sales_manager) {
    const manager = await User.findOne({
      where: { id: req.user.id },
    });
    if (!manager) {
      throw new Error("Manager is not found. user.id:" + req.user.id);
    }
    const data = await ordersRepo.getOrdersOfClients(manager.id);
    ////////
    console.log(data);

    // here I should format my client_id

    res.json(data);
  }
}
