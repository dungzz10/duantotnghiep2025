import express from "express";
import { createCODOrder, getOrderById, getAllOrders,updateOrder, checkDeliveredOrder,getNewOrders
    // deleteOrder
 } from "../controllers/orderController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const orderRoutes = express.Router();


orderRoutes.get('/check-delivered', checkDeliveredOrder);
orderRoutes.get("/", isAuththenticated, getAllOrders);
orderRoutes.get("/new", isAuththenticated, getNewOrders);
orderRoutes.post("/create",isAuththenticated, createCODOrder);
orderRoutes.get("/:orderId", isAuththenticated, getOrderById);
orderRoutes.patch("/orderStatus/:orderId", isAuththenticated, updateOrder);
// orderRoutes.delete("/:orderId", isAuththenticated, deleteOrder);
export default orderRoutes;
