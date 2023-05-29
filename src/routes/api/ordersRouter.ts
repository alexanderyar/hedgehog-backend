import express, {NextFunction, Request, Response} from "express";
import {ctrlWrapper} from "../../helpers";
import orders from "../../controllers/orders";

const router = express.Router();

router.get('/', ctrlWrapper(orders.getAll))

// TODO: ADD middleware which check ID and user. It should be done by Alex
router.get('/:id', ctrlWrapper(orders.getDetails))
router.put('/:orderId/changeStatus', ctrlWrapper(orders.updateOrderStatus))

export default router;