const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/productControll");
const { isAuththenticated } = require("../middlewares/auth");
router.post("/",isAuththenticated, createProduct);
module.exports = router;
