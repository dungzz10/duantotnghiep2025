import mongoose from 'mongoose';
import moment from 'moment-timezone';



const ReviewSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // tạo 1 khóa ngoại, dữ liệu là objectId
            ref: 'User',//Liên kết với collection user 
            required: true // bắt buộc có userid
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId, // tạo 1 khóa ngoại, dữ liệu là objectId
            ref: 'Product',//Liên kết với collection user 
            required: true // bắt buộc có userid
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('Reviews', ReviewSchema);