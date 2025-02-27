import express from "express";
import { getOrderById } from "../controllers/orderController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:orderId", isAuththenticated, getOrderById);

export default router;
