import axios from "axios";

// Gửi đánh giá sản phẩm
export const postReview = async (reviewData) => {
    const response = await axios.post('http://localhost:5000/api/v1/reviews', reviewData);
    return response.data;
};

// Kiểm tra xem user có đơn hàng "delivered" với sản phẩm này chưa
export const checkDeliveredOrder = async (orderId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/v1/orders/check-delivered`, {
            params: { orderId }
        });
        return response.status === 200;
    } catch (error) {
        console.error("Lỗi kiểm tra đơn hàng đã giao:", error.response?.data || error.message);
        return false;
    }
};
