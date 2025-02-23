import express from "express";
import {
  createAccessory,
  getallAccessory,
  updateAccessory,
} from "../controllers/accessory.js";
import { isAuththenticated } from "../middlewares/auth.js";
const RouterAccessory = express.Router();
RouterAccessory.get("/getall", isAuththenticated, getallAccessory);
RouterAccessory.post("/create", isAuththenticated, createAccessory);

RouterAccessory.post("/create", isAuththenticated, createAccessory);
RouterAccessory.put("/update", isAuththenticated, updateAccessory);

export default RouterAccessory;
