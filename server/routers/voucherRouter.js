import express from "express";
import { isAuththenticated } from "../middlewares/auth.js";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  applyVoucher
} from "../controllers/voucherController.js";

const voucherRouter = express.Router();

// Admin routes
voucherRouter
  .route("/admin/voucher")
  .post(isAuththenticated, createVoucher)
  .get(isAuththenticated, getAllVouchers);

voucherRouter
  .route("/admin/voucher/:id")
  .get(isAuththenticated, getVoucherById)
  .put(isAuththenticated, updateVoucher)
  .delete(isAuththenticated, deleteVoucher);

// Public routes
voucherRouter.post("/voucher/apply", isAuththenticated, applyVoucher);
voucherRouter.get("/voucher/active", getAllVouchers);

export default voucherRouter;