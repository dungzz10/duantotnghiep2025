import express from "express";
import { createCODOrder, getOrderById, getAllOrders,updateOrder, checkDeliveredOrder,getNewOrders,updateKho
    // deleteOrder
 } from "../controllers/orderController.js";
import { isAuththenticated } from "../middlewares/auth.js";
import { createWalletPayment } from "../controllers/paymentController.js";

const orderRoutes = express.Router();


orderRoutes.get('/check-delivered',isAuththenticated, checkDeliveredOrder);
orderRoutes.get("/", isAuththenticated, getAllOrders);
orderRoutes.get("/new", isAuththenticated, getNewOrders);
orderRoutes.post("/create",isAuththenticated, createCODOrder);
orderRoutes.post("/updateKho",isAuththenticated, updateKho);
orderRoutes.get("/:orderId", isAuththenticated, getOrderById);
orderRoutes.patch("/orderStatus/:orderId", isAuththenticated, updateOrder);
// orderRoutes.delete("/:orderId", isAuththenticated, deleteOrder);
orderRoutes.post("/wallet/payment", isAuththenticated, createWalletPayment);
export default orderRoutes;
