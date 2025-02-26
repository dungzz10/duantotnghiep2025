import express from "express";


const RouterReview = express.Router();
//lấy tất banner
RouterReview.get('/',getAllReviews);
//lấy banner theo id
RouterReview.get('/:id',getBannerById);
//tạo mới banner
RouterReview.post("/", createBanner);
// Cập nhật banner
RouterReview.put("/:id", updateBanner);
// Xóa banner
RouterReview.delete("/:id", removeBanner);

export default RouterReview;