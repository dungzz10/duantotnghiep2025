import express from "express";

import { createCategory, getAllCategory, getAllCategorynoProduct, getOneCategory, removeCategory, updateCategory } from "../controllers/category.js";
import { checkquyen, isAuththenticated } from "../middlewares/auth.js";
const RouterCategory = express.Router();

RouterCategory.get("/", getAllCategory);
 RouterCategory.get("/getall", getAllCategorynoProduct);
RouterCategory.get("/:id", getOneCategory);
RouterCategory.post("/create", createCategory);
RouterCategory.put("/:id/edit", updateCategory);
RouterCategory.delete("/:id/delete", removeCategory);

export default RouterCategory;