import express from "express";
import { createOrder, getOrderById, getAllOrders } from "../controllers/orderController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const router = express.Router();

// Lấy danh sách đơn hàng của người dùng
router.get("/", isAuththenticated, getAllOrders);

router.post("/",isAuththenticated, createOrder);
// Lấy đơn hàng theo ID
router.get("/:orderId", isAuththenticated, getOrderById);

export default router;
