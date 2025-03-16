import express from "express";
import { createMomoPayment, verifyTransaction, getWalletBalance, ipnNotification } from "../controllers/paymentController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/payment", isAuththenticated, createMomoPayment);
// Xác nhận trạng thái giao dịch
router.get("/verify/:orderId", isAuththenticated, verifyTransaction);

// Lấy số dư ví người dùng
router.get("/wallet", isAuththenticated, getWalletBalance);
router.post("/ipn",isAuththenticated,ipnNotification)

export default router;
