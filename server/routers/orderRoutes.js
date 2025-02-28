import express from "express";
import { createCODOrder, getOrderById, getAllOrders,updateOrder,deleteOrder } from "../controllers/orderController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const orderRoutes = express.Router();


orderRoutes.get("/", isAuththenticated, getAllOrders);
orderRoutes.post("/create",isAuththenticated, createCODOrder);
orderRoutes.get("/:orderId", isAuththenticated, getOrderById);
orderRoutes.patch("/orderStatus/:orderId", isAuththenticated, updateOrder);
orderRoutes.delete("/:orderId", isAuththenticated, deleteOrder);
export default orderRoutes;
