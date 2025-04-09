import express from "express";
import { createReview, getAllComments, getReviewByUserId, totalAllReview, totalReviewByProduct, updateReviewVisibility } from "../controllers/reviewController.js";



const RouterReview = express.Router();
//post review
RouterReview.post('/', createReview);
//ẩn hiện cmt
RouterReview.put('/:id', updateReviewVisibility);
//lấy tổng toàn bộ reivew
RouterReview.get('/total-reviews', totalAllReview);
//lấy review by user id 
RouterReview.get("/:userId", getReviewByUserId);
// tổng review by product
RouterReview.get("/total/:productId", totalReviewByProduct);
//lấy list review
RouterReview.get("/", getAllComments);




export default RouterReview;