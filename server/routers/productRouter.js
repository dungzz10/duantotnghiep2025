import express from "express";
import { createProduct, getAllProduct, getSingleProducts, updateProduct } from "../controllers/productControll.js";
import { isAuththenticated } from "../middlewares/auth.js";

const productRouter = express.Router();
productRouter.post("/", isAuththenticated, createProduct);
productRouter.get("/", getAllProduct);
productRouter.get("/:id", isAuththenticated,getSingleProducts);   
productRouter.put("/:id", isAuththenticated, updateProduct);
// productRouter.post(":id", createProduct);

export default productRouter