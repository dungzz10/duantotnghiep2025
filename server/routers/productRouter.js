const express = require("express");
const router = express.Router();
const { createProduct,getAllProduct } = require("../controllers/productControll");
const { isAuththenticated } = require("../middlewares/auth");
router.post("/",isAuththenticated, createProduct);
router.get("/products",isAuththenticated, getAllProduct);
module.exports = router;
