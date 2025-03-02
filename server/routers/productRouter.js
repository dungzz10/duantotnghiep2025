import express from "express";
import {
  createProduct,
  getAllProduct,
  getSingleProducts,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  getAllProductsisDelete,
  updateWarehouseStock,
  updateProductVariants,
} from "../controllers/productControll.js";
import { isAuththenticated } from "../middlewares/auth.js";

const productRouter = express.Router();

productRouter.get("/getall/", getAllProductsisDelete);
productRouter.post("/", isAuththenticated, createProduct);
productRouter.get("/", getAllProduct);
productRouter.get("/:id", isAuththenticated, getSingleProducts);
productRouter.put("/:id", isAuththenticated, updateProduct);
productRouter.put("/delete/:id", isAuththenticated, softDeleteProduct);
productRouter.put("/khoiphuc/:id", isAuththenticated, restoreProduct);
// productRouter.post(":id", createProduct);

// New routes for warehouse stock and product variants
// productRouter.put("/updateWarehouseStock/:id", updateWarehouseStock);
// productRouter.put("/updateProductVariants/:id", updateProductVariants);


export default productRouter;
