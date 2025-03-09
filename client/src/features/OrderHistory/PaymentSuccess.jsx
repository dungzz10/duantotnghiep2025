import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Result, Spin } from "antd";

const PaymentSuccess = () => {
  const location = useLocation();
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
        const response = await fetch(`http://localhost:5000/api/momo/verify/${orderId}`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          setOrder(result.order);
        } else {
          console.error("Không tìm được đơn hàng:", result.message);
        }
      } catch (error) {
        console.error("Lỗi đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location]);

  useEffect(() => {
    if (order) {
      console.log("Order details:", order);
    }
  }, [order]);
  
  if (loading) {
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
  }

  if (!order) {
    return (
      <Result
        status="error"
        title="Không tìm thấy đơn hàng"
        subTitle="Vui lòng kiểm tra lại mã đơn hàng hoặc liên hệ hỗ trợ."
      />
    );
  }

  return (
    <Result
      status="success"
      title="Thanh toán thành công"
      subTitle={`Mã đơn hàng: ${order.orderId}`}
      extra={[
        <div key="order-details">
          <p><strong>Trạng thái đơn hàng:</strong> {order.orderStatus}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Tổng tiền:</strong> {order.finalTotal + order.shippingFee} VNĐ</p>
        </div>
      ]}
    />
  );
};

export default PaymentSuccess;