import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

//------------------------tạo đánh giá -----------------------

export const createReview = async (req, res) => {
    try {
        const { comment, rating, productId, userId } = req.body;
        if (!comment || !rating || !productId || !userId) {
            return res.status(400).json({ message: "Tất cả các trường đều bắt buộc" });
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        let review = await Review.findOne({ productId, userId });

        if (review) {
           return res.status(400).json({message: "bạn đã đánh giá sản phẩm này rồi"})
        } else {
            // Tạo mới review nếu chưa tồn tại
            review = await Review.create({ comment, rating, productId, userId });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

         // Tính lại tổng số đánh giá và điểm trung bình
         const totalReviews = await Review.find({ productId });
         const totalRating = totalReviews.reduce((acc, review) => acc + review.rating, 0);
         const averageRating = totalRating / totalReviews.length;
 
         // Cập nhật vào DB
         product.ratingQuantity = totalReviews.length; // Cập nhật số lượng đánh giá
         product.rating = averageRating; // Cập nhật điểm trung bình
         await product.save({ validateBeforeSave: false });
 
         return res.status(200).json({
             message: "Bình luận thành công",
             reviews: totalReviews,
             rating: product.rating,
             ratingQuantity: product.ratingQuantity
         });
    } catch (error) {
        console.log("Lỗi:", error);
        return res.status(500).send({ message: "Lỗi khi bình luận" });
    }
};

//------------------------tổng toàn bộ đánh gía  -----------------------
export const totalAllReview = async (req, res) => {
    try {
        const totalReviews = await Review.countDocuments({});
        return res.status(200).json({ message: "Tổng số review", totalReviews });
    } catch (error) {
        console.log("Lỗi khi lấy tổng số review:", error);
        res.status(500).send({ message: "Lỗi" });
    }
};

//------------------------lấy đánh giá của sản phẩm -----------------------
export const getReviewByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "UserId bắt buộc có" });
    }
    try {
        const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
        if (reviews.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy review" });
        }
        return res.status(200).send(reviews);
    } catch (error) {
        console.log("Lỗi khi lấy review theo user:", error);
        res.status(500).send({ message: "Lỗi khi lấy review" });
    }
};

//------------------------lấy tổng đánh giá của 1 sản phẩm -----------------------
export const totalReviewByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "ProductId bắt buộc có" });
        }

        // Kiểm tra productId có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ProductId không hợp lệ" });
        }

        // Lấy số lượng đánh giá từ bảng Product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        return res.status(200).json({
            message: "Tổng số review của sản phẩm",
            productId,
            ratingQuantity: product.ratingQuantity, // Lấy số lượng đánh giá từ bảng Product
            averageRating: product.rating, // Lấy điểm trung bình đánh giá
        });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số review của sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi khi lấy tổng số review của sản phẩm" });
    }
};