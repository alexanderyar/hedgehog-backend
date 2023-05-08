import express from "express";
import supplierController from '../../controllers/suppliers';
const router = express.Router();

router.use('/', supplierController.getAll);

export default router;