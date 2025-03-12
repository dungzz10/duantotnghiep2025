import express from "express";
import { addToCart, getCartDetails } from "../controllers/cartController.js";
import { isAuththenticated } from "../middlewares/auth.js";

const cartRoutes = express.Router();

cartRoutes.post("/add", isAuththenticated, addToCart);
cartRoutes.get("/details", isAuththenticated, getCartDetails);
export default cartRoutes;
