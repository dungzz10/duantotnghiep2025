import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Spin, message } from "antd";
import { getBaseUrl } from "../../utils/baseURL";

const ATMSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("orderId");

    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/api/momo/verify/${orderId}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setOrder(result.order);
          if (result.redirect) {
            message.success("Đơn hàng của bạn đã được xác nhận thành công. Bạn sẽ được chuyển hướng về trang chủ trong 5 giây.");
            setTimeout(() => {
              navigate("/");  
            }, 5000);
          }
        } else {
          message.error(result.message || "Không tìm thấy đơn hàng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location, navigate]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
    <Result
      status="success"
      title="Xác nhận thanh toán thành công!"
      subTitle={order ? `Đơn hàng của bạn (${order.orderId}) đã được xác nhận.` : "Đang xác nhận thông tin đơn hàng..."}
    />
  </div>
  );
};

export default ATMSuccess;
