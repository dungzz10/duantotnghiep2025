import express from "express";
import { createBanner, getAllBanners, getBannerById, removeBanner, updateBanner } from "../controllers/bannerController.js";
import upload from "../middlewares/upload.js";



const RouterBanner = express.Router();
//lấy tất banner
RouterBanner.get('/',getAllBanners);
//lấy banner theo id
RouterBanner.get('/:id',getBannerById);
//tạo mới banner
RouterBanner.post("/",createBanner);
// Cập nhật banner
RouterBanner.patch("/:id",upload.single("image"), updateBanner);
// Xóa banner
RouterBanner.delete("/:id", removeBanner);

export default RouterBanner;