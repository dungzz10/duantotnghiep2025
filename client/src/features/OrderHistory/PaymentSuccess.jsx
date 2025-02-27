import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    if (!orderId) return navigate("/");

    const verifyPayment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/momo/verify/${orderId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("Kết quả xác nhận thanh toán:", data);

        if (data.success && data.status === "completed") {
          localStorage.removeItem("cart");

          alert("Thanh toán thành công! Đơn hàng đang được chuẩn bị.");
          navigate(`/cart?success=true`);
        } else {
          alert(`Thanh toán thất bại: ${data.message}`);
          navigate(`/cart?success=false`);
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
    <div>
      <h2>Đang kiểm tra trạng thái thanh toán...</h2>
      <p>Mã đơn hàng: {new URLSearchParams(location.search).get("orderId")}</p>
    </div>
  );
};

export default PaymentSuccess;
