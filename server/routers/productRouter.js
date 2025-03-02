import express from "express";
import {
  createProduct,
  getAllProduct,
  getSingleProducts,
  updateProduct,
  softDeleteProduct,
  restoreProduct,
  getAllProductsisDelete

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


// Quản lý biến thể và kho hàng
productRouter.post("/:productId/variants", isAuththenticated, addVariant);
productRouter.put(
  "/:productId/variants/:variantId",
  isAuththenticated,
  updateVariant
);
productRouter.delete(
  "/:productId/variants/:variantId",
  isAuththenticated,
  deleteVariant
);
productRouter.put(
  "/:productId/variants/:variantId/sizes/:sizeId/inventory",
  isAuththenticated,
  updateInventory
);


export default productRouter;
