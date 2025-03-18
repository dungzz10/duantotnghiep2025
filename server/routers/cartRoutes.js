import express from "express";
import { addToCart, getCartDetails, deleteCart } from "../controllers/cartController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const cartRoutes = express.Router();

cartRoutes.post("/add", isAuththenticated, addToCart);
cartRoutes.get("/details", isAuththenticated, getCartDetails);
cartRoutes.post("/delete", isAuththenticated, deleteCart);
export default cartRoutes;
