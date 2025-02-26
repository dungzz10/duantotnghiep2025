import express from "express";
import { createReview, getReviewByUserId, totalReview } from "../controllers/reviewController.js";



const RouterReview = express.Router();
//post review
RouterReview.post('/', createReview);
//lấy tổng reivew
RouterReview.get('/total-reviews', totalReview);
//lấy review by user id 
RouterReview.get("/:userId", getReviewByUserId);


export default RouterReview;