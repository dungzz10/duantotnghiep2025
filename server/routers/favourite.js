import express from "express";

import {
  createFavourite,
  getFavourites,
  isFavourite,
  removeFavourite,
} from "../controllers/favouriteController.js";
import { isAuththenticated } from "../middlewares/auth.js";
const RouterFavourite = express.Router();

RouterFavourite.post("/:id", isAuththenticated, createFavourite);
RouterFavourite.get("/", isAuththenticated, getFavourites);

RouterFavourite.delete("/:id", isAuththenticated, removeFavourite);
RouterFavourite.get("/isfavourite/:id", isAuththenticated, isFavourite);

export default RouterFavourite;
