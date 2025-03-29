import express from "express";
import {
  checkDeliveredOrder,
  createCODOrder,
  deleteOrder,
  getAllOrders,
  getByrecipientPhone,
  getByUserPhone,
  getNewOrders,
  getOrderById,
  updateKho,
  updateOrder,
} from "../controllers/orderController.js";
import { createWalletPayment } from "../controllers/paymentController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const orderRoutes = express.Router();

orderRoutes.get(
  "/recipientPhone-check/:recipientPhone",
  isAuththenticated,
  getByrecipientPhone
);

orderRoutes.get(
  "/userPhone-check/:phoneNumber",
  isAuththenticated,
  getByUserPhone
);

orderRoutes.get("/check-delivered", isAuththenticated, checkDeliveredOrder);
orderRoutes.get("/", isAuththenticated, getAllOrders);
orderRoutes.get("/new", isAuththenticated, getNewOrders);
orderRoutes.post("/create", isAuththenticated, createCODOrder);
orderRoutes.post("/updateKho", isAuththenticated, updateKho);
orderRoutes.get("/:orderId", isAuththenticated, getOrderById);
orderRoutes.patch("/orderStatus/:orderId", isAuththenticated, updateOrder);
orderRoutes.delete("/:orderId", isAuththenticated, deleteOrder);
orderRoutes.post("/wallet/payment", isAuththenticated, createWalletPayment);

export default orderRoutes;
