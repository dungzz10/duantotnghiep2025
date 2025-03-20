import express from "express";
import { isAuththenticated } from "../middlewares/auth.js";
import { 
  topUsers, 
  topProducts, 
  orderStatistics,
  orderSuccessRate 
} from "../controllers/thongkeControll.js";

const Thongke = express.Router();

// Route cho thống kê top 10 users đặt hàng nhiều nhất
Thongke.route("/top-users").get(isAuththenticated, topUsers);

// Route cho thống kê top 10 sản phẩm bán chạy nhất
Thongke.route("/top-products").get(isAuththenticated, topProducts);

// Route cho thống kê đơn hàng theo khoảng thời gian
Thongke.route("/order-statistics").get(isAuththenticated, orderStatistics);

// Route cho thống kê tỷ lệ thành công của đơn hàng
Thongke.route("/order-success-rate").get(isAuththenticated, orderSuccessRate);

export default Thongke;