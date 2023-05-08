import express from "express";
import authRouter from "./authRouter";
import suppliersRouter from "./suppliersRouter";
const router = express.Router();

router.use('/auth', authRouter);
router.use('/suppliers', suppliersRouter);

export default router;
