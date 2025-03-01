import express from "express";

import {
  createFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { isAuththenticated } from "../middlewares/auth.js";
const RouterFavourite = express.Router();
RouterFavourite.post("/create  ", createFavourite);
RouterFavourite.delete("/:id/delete  ", isAuththenticated, removeFavourite);

export default RouterFavourite;
