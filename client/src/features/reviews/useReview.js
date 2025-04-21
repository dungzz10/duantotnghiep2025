import axios from "axios";
import { getBaseUrl } from "../../utils/baseURL";

export const postReview = async (reviewData) => {
    try {
        console.log("Dữ liệu gửi lên server:", reviewData); // Log kiểm tra

        const response = await axios.post(`${getBaseUrl()}/api/v1/reviews`, reviewData, {
            headers: { "Content-Type": "application/json" },
        });
        console.log("Phản hồi từ server:", response.data); // Log kiểm tra
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error.response?.data || error.message);
        throw error;
    }
};


// Hàm kiểm tra đơn hàng đã giao qua userId và productId
export const checkDeliveredOrder = async (userId, productId) => {

    try {
        const response = await axios.get(`${getBaseUrl()}/api/v1/orders/check-delivered`, {
            params: { userId, productId }
        });
        return response.status === 200;
    } catch (error) {
        console.error("Lỗi kiểm tra đơn hàng đã giao:", error.response?.data || error.message);
        return false;
    }
};

export const getTotalReviewsByProduct = async(productId) =>{
    try {
        const response = await axios.get(`${getBaseUrl()}/api/v1/reviews/total/${productId}`);
        return response.data.ratingQuantity;
    } catch (error) {
        console.error("Lỗi lấy tổng số review:", error.response?.data || error.message);
        return 0;
    }
}