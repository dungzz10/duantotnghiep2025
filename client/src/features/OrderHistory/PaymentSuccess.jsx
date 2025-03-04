import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification, Result, Spin } from "antd";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    if (!orderId) return navigate("/cart/checkout");

    const verifyPayment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/momo/verify/${orderId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("Kết quả xác nhận thanh toán:", data);

        if (data.success) {
          localStorage.removeItem("cart");
          notification.success({
            message: "Thanh toán thành công",
            description: "Đơn hàng đang được chuẩn bị. Bạn sẽ được chuyển về trang chủ sau 5 giây.",
            duration: 5,
          });
          setTimeout(() => navigate("/momo-success"), 5000);
        } else {
          notification.error({
            message: "Thanh toán thất bại",
            description: data.message || "Có lỗi xảy ra khi xác nhận thanh toán!",
            duration: 5,
          });
          setTimeout(() => navigate("/"), 5000);
        }
      } catch (error) {
        console.error("Lỗi xác nhận giao dịch:", error);
        alert("Có lỗi xảy ra khi xác nhận thanh toán!");
        navigate("/cart");
      }
    };
    verifyPayment();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Spin size="large" />
      <Result
        status="info"
        title="Đang kiểm tra trạng thái thanh toán..."
        subTitle={`Mã đơn hàng: ${new URLSearchParams(location.search).get("orderId")}`}
      />
    </div>
  );
};

export default PaymentSuccess;
