import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Col,
  Divider,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import { getAddress } from "../adress/useAddresApi";
import NoOrderPage from "./NoOrderPage";
import AddressForm from "../adress/AddressForm";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data, isLoading } = getAddress();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdatePhone, setIsUpdatePhone] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setcustomerPhone] = useState("");

  const handleOpenModal = (address = null) => {
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  };

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setCustomerName(storedUser?.name || "");
      setcustomerPhone(storedUser?.phoneNumber || "");
    }

    if (!storedOrder) {
      navigate("/no-order");
    } else {
      setOrder(storedOrder);
      setUser(storedUser);
      setShippingFee(storedOrder.shippingFee || 30000);
    }
  }, [navigate]);

  useEffect(() => {
    if (data && data.addresses && data.addresses.length > 0) {
      const lastAddress = data.addresses[data.addresses.length - 1].address;
      setSelectedAddress(lastAddress);

      if (order) {
        setOrder((prev) => ({
          ...prev,
          shippingAddress: {
            ...prev.shippingAddress,
            address: data.addresses[0].address,
          },
        }));
      }
    }
  }, [data]);

  console.log("address", data);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) return <NoOrderPage />;

  const voucherDiscount = order.voucherDiscount || 0;
  const rawTotal = order.total || 0;
  const finalTotal = Math.round(rawTotal + shippingFee - voucherDiscount);

  const handlePayment = async () => {
    if (!order) return;
    const Name = `${customerName}`;
    const Phone = `${customerPhone}`;
    if (order.shippingAddress?.address) {
      order.shippingAddress = {
        address: selectedAddress,
      };
    }
    const products = order.products.map((product) => ({
      productId: product.productId || product.id || "",
      name: product.name || product.title || "Không có tên",
      price: product.price || 0,
      quantity: product.quantity || 1,
      totalPrice: product.totalPrice || product.price * product.quantity || 0,
      image: product.image || "",
      color: product.color || "Unknown",
      size: product.size || "Unknown",
    }));

    if (["COD", "WALLET"].includes(paymentMethod)) {
      try {
        const inventoryResponse = await fetch(
          "http://localhost:5000/api/v1/orders/updateKho",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({ products }),
          }
        );

        const inventoryData = await inventoryResponse.json();
        if (!inventoryResponse.ok || !inventoryData.success) {
          message.error(`Cập nhật tồn kho thất bại: ${inventoryData.message}`);
          return;
        }
      } catch (error) {
        console.error("Lỗi cập nhật tồn kho:", error);
        message.error("Có lỗi xảy ra khi cập nhật tồn kho!");
        return;
      }
    }
    if (paymentMethod === "WALLET") {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/orders/wallet/payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({
              amount: finalTotal,
              finalTotal: finalTotal,
              orderId: `ORDER_${Date.now()}`,
              orderInfo: `Thanh toán đơn hàng #${Date.now()}`,
              shippingAddress: order.shippingAddress,
              paymentMethod: "WALLET",
              products,
            }),
          }
        );

        console.log(response, 1234567);

        const data = await response.json();

        if (response.ok && data.success) {
          await fetch("http://localhost:5000/api/v1/carts/deleteCart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({
              orderProducts: products,
            }),
          });
          message.success("Thanh toán từ ví thành công!");
          localStorage.removeItem("cart");
          localStorage.removeItem("order");

          navigate("/");
        } else {
          message.error(`Thanh toán ví thất bại: ${data.message}`);
        }
      } catch (error) {
        console.error("Lỗi thanh toán ví:", error);
        message.error("Có lỗi xảy ra khi thanh toán từ ví!");
      }
    }

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
        const response = await fetch(
          "http://localhost:5000/api/v1/orders/create",
          {
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
              Name,
              Phone,
            }),
          }
        );

        const data = await response.json();
        if (response.ok && data.success) {
          await fetch("http://localhost:5000/api/v1/carts/deleteCart", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({
              orderProducts: products,
            }),
          });
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

  const updatePhone = () => {
    setIsUpdatePhone(!isUpdatePhone);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 md:p-8">
      <Card className="shadow-lg" bordered>
        {/* Most of the JSX remains the same */}

        {/* Update the Select component to use data from API */}
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Card title="Thông tin người nhận" size="small">
              <Text>
                {/* <strong>Tên:</strong> {user?.name} */}

                <label>Ten nguoi nhan</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="nhap ten nguoi nhan"
                  required
                />
              </Text>
              <br />
              <Text>
                <strong>Email:</strong> {user?.email}
              </Text>
              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {" "}
                <div className="display: block">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleOpenModal()}
                    >
                      Thêm địa chỉ
                    </Button>
                  </div>
                  <div>
                    <strong style={{ whiteSpace: "nowrap" }}>Địa chỉ:</strong>
                    <Select
                      style={{ flex: 1 }}
                      value={selectedAddress}
                      onChange={(value) => {
                        setSelectedAddress(value);
                        setOrder((prev) => ({
                          ...prev,
                          shippingAddress: {
                            ...prev.shippingAddress,
                            address: value,
                          },
                        }));
                      }}
                    >
                      {data?.addresses?.map((addr, idx) => (
                        <Select.Option key={idx} value={addr.address}>
                          {addr.address}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <AddressForm
                visible={isModalVisible}
                onClose={handleCloseModal}
                address={editingAddress}
              />
              <br />

              <label>so dien thoai</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setcustomerPhone(e.target.value)}
                placeholder="nhap so dien thoai"
                required
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Thông tin đơn hàng" size="small">
              {order.products &&
                order.products.map((product, index) => (
                  <div key={index} className="mb-3 border-b pb-2">
                    <Text>
                      <strong>Tên:</strong> {product.title}
                    </Text>
                    <br />
                    <Text>
                      <strong>Số lượng:</strong> {product.quantity}
                    </Text>
                    <br />
                    <Text>
                      <strong>Màu:</strong> {product.color}
                    </Text>
                    <br />
                    <Text>
                      <strong>Size:</strong> {product.size}
                    </Text>
                    <br />
                    <Text>
                      <strong>Giá:</strong> {product.price * product.quantity}{" "}
                      VNĐ
                    </Text>
                  </div>
                ))}
              <Divider />
              <Text>
                <strong>Phí vận chuyển:</strong> {shippingFee} VNĐ
              </Text>
              <br />
              <Text>
                <strong>Giảm giá:</strong> {voucherDiscount} VNĐ
              </Text>
              <br />
              <Title level={4} className="mt-2">
                Tổng cộng: {finalTotal} VNĐ
              </Title>
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
                  <Radio value="WALLET">Thanh toán từ ví</Radio>

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
