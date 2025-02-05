import express from "express";
import { createProduct, GetallProduct } from "../controllers/productControll.js";
import { isAuththenticated } from "../middlewares/auth.js";
const productRouter = express.Router();
productRouter.post("/", isAuththenticated, createProduct);
productRouter.get("/", GetallProduct);
// productRouter.post(":id", createProduct);

export default productRouter