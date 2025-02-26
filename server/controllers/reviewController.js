import reviewsModel from "../models/reviewsModel";

export const getAllReviews = async(req,res) =>{
    try {
        
    } catch (error) {
        console.log("Lỗi ");
        
    }
}

export const createReview = async(req,res) =>{
    try {
        const {comment,rating,productId,userId} = req.body;
        if(!comment || !rating || !productId || !userId){
            return res.status(400).json({
                message: "tất cả các trường đều bắt buộc"
            })
            const existingReview = await Reviews.findOne({productId, userId});
            if(existingReview){
                
            }
        }
    } catch (error) {
        console.log("Lỗi ");
        
    }
}