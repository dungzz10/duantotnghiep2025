import express from "express";
import { createReview, getReviewByUserId, totalAllReview, totalReviewByProduct } from "../controllers/reviewController.js";



const RouterReview = express.Router();
//post review
RouterReview.post('/', createReview);
//lấy tổng toàn bộ reivew
RouterReview.get('/total-reviews', totalAllReview);
//lấy review by user id 
RouterReview.get("/:userId", getReviewByUserId);
// tổng review by product
RouterReview.get("/total/:productId", totalReviewByProduct);

export default RouterReview;