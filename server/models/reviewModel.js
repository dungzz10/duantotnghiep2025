import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
    {
        comment: { 
            type: String, 
            required: false // Không bắt buộc, chỉ cần rating là đủ
        },
        rating: { 
            type: Number, 
            required: true,
            min: 1, // Giới hạn điểm đánh giá từ 1 đến 5
            max: 5  
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', // Liên kết với bảng User 
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', // Liên kết với bảng Product
            required: true
        },
        hidden: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: true, updatedAt: true } // Bật timestamps
    }
);

export default mongoose.model('Review', ReviewSchema);
