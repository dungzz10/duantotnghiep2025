import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Row, Col, Card, Radio, Space } from "antd";

import NoOrderPage from "./NoOrderPage";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    if (!storedOrder) {
      navigate("/no-order");
    } else {
      setOrder(storedOrder);
    }
  }, [navigate]);

  if (!order) return <NoOrderPage />;

  const handlePayment = async () => {
    if (!order) return;

    if (!order.shippingAddress?.address) {
      order.shippingAddress = {
        ...order.shippingAddress,
        address: "home",
      };
    }
    if (!order.total) {
      alert("Tổng tiền không hợp lệ!");
      return;
    }
    const finalTotal = order.total;

    const finalOrder = {
      ...order,
      paymentMethod: paymentMethod, 
      finalTotal,
    };

    if (paymentMethod === "ATM_MOMO" || paymentMethod === "QR_MOMO") {
      try {
        
        const amount = Math.round(order.total);
        const paymentType = paymentMethod === "ATM_MOMO" ? "atm" : "qr";
        const response = await fetch("http://localhost:5000/api/momo/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          credentials: "include",
          body: JSON.stringify({
            amount: amount,
            orderId: `ORDER_${Date.now()}`,
            orderInfo: `Thanh toán đơn hàng #${Date.now()}`,
            shippingAddress: order.shippingAddress,
            products: order.products.map((product) => ({
              productId: product.productId || product.id || "",
              name: product.name || product.title || "Không có tên",
              price: product.price || 0,
              quantity: product.quantity || 1,
              totalPrice:
                product.totalPrice || product.price * product.quantity || 0,
              image: product.image || "",
              color: product.color || "Unknown",
              size: product.size || "Unknown",
            })),
            paymentType,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.data?.payUrl) {
          console.log("Chuyển hướng tới MoMo:", data.data.payUrl);
          localStorage.setItem("momoOrderId", data.data.orderId);
          window.location.href = data.data.payUrl;
        } else {
          alert(`Thanh toán MoMo thất bại: ${data.message}`);
        }
      } catch (error) {
        console.error("Lỗi thanh toán MoMo:", error);
        alert("Có lỗi xảy ra khi thanh toán!");
      }
    } else {
      try {
        
        const response = await fetch(
          "http://localhost:5000/api/v1/orders/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify(finalOrder),
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert("Thanh toán thành công! Đơn hàng đã được tạo.");
          localStorage.removeItem("cart");
          localStorage.removeItem("order");
          navigate("/");
        } else {
          alert(`Tạo đơn hàng thất bại: ${data.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng COD:", error);
        alert("Có lỗi xảy ra khi đặt hàng!");
      }
    }
  };

  if (!order) return null;

  return (
    <div>
      <div className="container mx-auto p-6 md:p-10">
        <Card className="shadow-lg p-6" bordered>
          <Row justify="space-between" align="middle" className="mb-6">
            <Col>
              <Title level={2}>Hoá đơn</Title>
            </Col>
            <Col>
              <Space>
              </Space>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Card title="Thông tin khách hàng">
                <Text>Tên: {order.user?.name}</Text>
                <br />
                <Text>Email: {order.user?.email}</Text>
                <br />
                <div className="addresses">
                  <Text strong>Địa chỉ:</Text>
                  {Array.isArray(order.user?.address) ? (
                    order.user.address.map((addr, index) => (
                      <div key={addr._id || index} className="ml-4 mt-2">
                        <Text>
                          {addr.addressType}: {addr.address}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <Text className="ml-4">{order.user?.address}</Text>
                  )}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Thông tin đơn hàng">
                {order.products.map((product, index) => (
                  <div key={index} className="mb-2">
                    <Text>
                      Tên: {product.title} x {product.quantity}
                    </Text>
                    <br />
                    <Text>Giá :{product.price * product.quantity} VNĐ</Text>
                  </div>
                ))}
                <Title level={4} className="mt-4">
                  Tổng cộng: {order.total} VNĐ
                </Title>
              </Card>
            </Col>
          </Row>
          <Card title="Phương thức thanh toán" className="mt-5">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="COD">Thanh toán khi nhận hàng</Radio>
              <Radio value="ATM_MOMO">Chuyển khoản ATM MOMO</Radio>
              <Radio value="QR_MOMO">Quét mã QR MoMo</Radio>
            </Radio.Group>
          </Card>
          <Row justify="center" className="mt-5">
            <Button
              type="primary"
              size="large"
              className="bg-green-500 text-white"
              onClick={handlePayment}
            >
              Xác nhận Thanh Toán
            </Button>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
