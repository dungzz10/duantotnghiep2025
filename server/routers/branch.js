import express from "express";
import { checkPermission } from "../middlewares/CheckPermission.js";
import { createBranch, getAllBranch, getOneBranch, removeBranch, updateBranch } from "../controllers/branch.js";
const RouterBranch = express.Router();

RouterBranch.get("/", getAllBranch);
RouterBranch.get("/:id", getOneBranch);
RouterBranch.post("/create", checkPermission, createBranch);
RouterBranch.put("/:id/edit", checkPermission, updateBranch);
RouterBranch.delete("/:id/delete", checkPermission, removeBranch);

export default RouterBranch; 