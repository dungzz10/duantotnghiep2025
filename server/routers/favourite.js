import express from "express";

import {
  createFavourite,
  getFavourites,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { isAuththenticated } from "../middlewares/auth.js";
const RouterFavourite = express.Router();

RouterFavourite.post("/", isAuththenticated, createFavourite);
RouterFavourite.get("/", isAuththenticated, getFavourites);

RouterFavourite.delete("/:id", isAuththenticated, removeFavourite);

export default RouterFavourite;
