import express from "express";
import { checkPermission } from "../middlewares/CheckPermission.js";
import { createCategory, getAllCategory, getOneCategory, removeCategory, updateCategory } from "../controllers/category.js";
import { checkquyen, isAuththenticated } from "../middlewares/auth.js";
const RouterCategory = express.Router();

RouterCategory.get("/", getAllCategory);
RouterCategory.get("/:id", getOneCategory);
RouterCategory.post("/create", isAuththenticated, createCategory);
RouterCategory.put("/:id/edit", isAuththenticated, updateCategory);
RouterCategory.delete("/:id/delete", isAuththenticated, removeCategory);

export default RouterCategory; 