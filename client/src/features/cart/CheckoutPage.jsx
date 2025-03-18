import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Row, Col, Card, Radio, Space, message,Divider } from "antd";

import NoOrderPage from "./NoOrderPage";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingFee, setShippingFee] = useState(0);
  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedOrder) {
      navigate("/no-order");
    } else {
      setOrder(storedOrder);
      setUser(storedUser);
      setShippingFee(storedOrder.shippingFee || 30000);
    }
  }, [navigate]);

  if (!order) return <NoOrderPage />;

  const voucherDiscount = order.voucherDiscount || 0;
  const rawTotal = order.total || 0;
  const finalTotal = Math.round(rawTotal + shippingFee - voucherDiscount);

  const handlePayment = async () => {
    if (!order) return;

    if (!order.shippingAddress?.address) {
      order.shippingAddress = {
        ...order.shippingAddress,
        address: "home",
      };
    }
    const products = order.products.map((product) => ({
      productId: product.productId || product.id || "",
      name: product.name || product.title || "Không có tên",
      price: product.price || 0,
      quantity: product.quantity || 1,
      totalPrice:
        product.totalPrice || product.price * product.quantity || 0,
      image: product.image || "",
      color: product.color || "Unknown",
      size: product.size || "Unknown",
    }));
  
    
    if (["ATM_MOMO", "QR_MOMO"].includes(paymentMethod)) {
      try {
        const paymentType = paymentMethod === "ATM_MOMO" ? "atm" : "qr";
        const response = await fetch("http://localhost:5000/api/momo/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            amount: finalTotal,
            orderId: `ORDER_${Date.now()}`,
            orderInfo: `Thanh toán đơn hàng #${Date.now()}`,
            shippingAddress: order.shippingAddress,
            products,
            paymentType,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.data?.payUrl) {
          console.log("Chuyển hướng tới MoMo:", data.data.payUrl);
          localStorage.setItem("momoOrderId", data.data.orderId);
          window.location.href = data.data.payUrl;
        } else {
          message.error(`Thanh toán MoMo thất bại: ${data.message}`);
        }
      } catch (error) {
        console.error("Lỗi thanh toán MoMo:", error);
        message.error("Có lỗi xảy ra khi thanh toán!");
      }
    } else if (paymentMethod === "COD") {
      try {
        const response = await fetch("http://localhost:5000/api/v1/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            products,
            total: rawTotal,
            shippingAddress: order.shippingAddress,
            shippingFee,
            voucherDiscount,
            amount: finalTotal,
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.success) {
          message.success("Thanh toán COD thành công! Đơn hàng đã được tạo.");
          localStorage.removeItem("cart");
          localStorage.removeItem("order");
          navigate("/");
        } else {
          message.error(`Tạo đơn hàng thất bại: ${data.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng COD:", error);
        message.error("Có lỗi xảy ra khi đặt hàng!");
      }
    }
  };

  if (!order) return null;

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 md:p-8">
      <Card className="shadow-lg" bordered>
        <Row justify="space-between" align="middle" className="mb-6">
          <Col>
            <Title level={2}>Hoá đơn</Title>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Thông tin khách hàng" size="small">
              <Text><strong>Tên:</strong> {user?.name}</Text><br />
              <Text><strong>Email:</strong> {user?.email}</Text><br />
              <Text><strong>Địa chỉ:</strong> {user?.address?.[0]?.address}</Text><br />
              <Text><strong>Số điện thoại:</strong> {user?.phoneNumber}</Text>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Thông tin đơn hàng" size="small">
              {order.products.map((product, index) => (
                <div key={index} className="mb-3 border-b pb-2">
                  <Text><strong>Tên:</strong> {product.title}</Text><br />
                  <Text><strong>Số lượng:</strong> {product.quantity}</Text><br />
                  <Text><strong>Màu:</strong> {product.color}</Text><br />
                  <Text><strong>Size:</strong> {product.size}</Text><br />
                  <Text><strong>Giá:</strong> {product.price * product.quantity} VNĐ</Text>
                </div>
              ))}
              <Divider />
              <Text><strong>Phí vận chuyển:</strong> {shippingFee} VNĐ</Text><br />
              <Text><strong>Giảm giá:</strong> {voucherDiscount} VNĐ</Text><br />
              <Title level={4} className="mt-2">Tổng cộng: {finalTotal} VNĐ</Title>
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-5">
          <Col span={24}>
            <Card title="Phương thức vận chuyển">
              <Text>Giao hàng tiêu chuẩn (3 - 5 ngày) - {shippingFee} VNĐ</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={24} className="mt-5">
          <Col span={24}>
            <Card title="Phương thức thanh toán">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                  <Radio value="ATM_MOMO">Chuyển khoản ATM MOMO</Radio>
                  <Radio value="QR_MOMO">Quét mã QR MoMo</Radio>
                </Space>
              </Radio.Group>
            </Card>
          </Col>
        </Row>

        <Row justify="center" className="mt-6">
          <Button
            type="primary"
            size="large"
            className="bg-green-500 text-white px-8 py-2"
            onClick={handlePayment}
          >
            Xác nhận Thanh Toán
          </Button>
        </Row>
      </Card>
    </div>
  );
};

export default CheckoutPage;
