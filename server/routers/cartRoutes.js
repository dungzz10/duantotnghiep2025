import express from "express";
import {
  addToCart,
  getCartDetails,
  deleteCart,
  clearCart,
  update,
} from "../controllers/cartController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const cartRoutes = express.Router();

cartRoutes.post("/add", isAuththenticated, addToCart);
cartRoutes.get("/details", isAuththenticated, getCartDetails);
cartRoutes.delete("/delete", isAuththenticated, deleteCart);
cartRoutes.delete("/deleteCart", isAuththenticated, clearCart);
cartRoutes.post("/update", isAuththenticated, update);

export default cartRoutes;
