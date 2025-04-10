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
  Input,
} from "antd";

import { getAddress } from "../adress/useAddresApi";
import NoOrderPage from "./NoOrderPage";
import AddressForm from "../adress/AddressForm";
import { useUser } from "../../app/hook/LoadUser";
import { Option } from "antd/es/mentions";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingFee, setShippingFee] = useState(0);
  const [initialShippingFee] = useState(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    return storedOrder?.shippingFee;
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { data, isLoading } = getAddress();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isUpdatePhone, setIsUpdatePhone] = useState(false);
  const { refetch } = useUser();
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState("standard");

  // New state variables for recipient information
  const [isOtherRecipient, setIsOtherRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  console.log(recipientAddress);

  // Thêm state mới cho voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [availableVouchers, setAvailableVouchers] = useState([]);

  // Thêm effect để load vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/vouchers/voucher/active",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data, 123456789);
        if (response.ok && data.success) {
          setAvailableVouchers(data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleOpenModal = (address = null) => {
    console.log("Modal Opened");
    setEditingAddress(address);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingAddress(null);
  };
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0|\+84)[35789]\d{8}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedOrder) {
      navigate("/no-order");
    } else {
      setOrder(storedOrder);
      setUser(storedUser);
      setShippingFee(storedOrder.shippingFee);
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

  const shippingOptions = [
    {
      value: "standard",
      label: "Giao hàng tiêu chuẩn (3 - 5 ngày)",
      fee: initialShippingFee,
    },
    {
      value: "fast",
      label: "Giao hàng nhanh (1 - 2 ngày)",
      fee: initialShippingFee + 20000,
    },
    {
      value: "express",
      label: "Giao hàng siêu tốc (1 ngày nội tỉnh)",
      fee: initialShippingFee + 50000,
    },
    {
      value: "international",
      label: "Giao hàng quốc tế (5 - 7 ngày)",
      fee: initialShippingFee - 15000,
    },
  ];
  const handleShippingChange = (value) => {
    if (value !== selectedShippingMethod) {
      const selectedOption = shippingOptions.find(
        (option) => option.value === value
      );
      setSelectedShippingMethod(value);
      setShippingFee(selectedOption.fee);
      setOrder((prev) => ({
        ...prev,
        shippingFee: selectedOption.fee,
      }));
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!order) return <NoOrderPage />;

  const voucherDiscount = order.voucherDiscount || 0;
  const rawTotal = order.total || 0;
  const finalTotal = Math.round(rawTotal + shippingFee - voucherDiscount);

  // Thêm hàm xử lý voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/vouchers/voucher/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            code: voucherCode,
            orderValue: rawTotal,
            userId: user?._id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        message.success("Áp dụng voucher thành công!");
        setAppliedVoucher(data.data.voucher);
        setOrder((prev) => ({
          ...prev,
          voucherDiscount: data.data.discountAmount,
        }));
      } else {
        message.error(data.message || "Không thể áp dụng voucher!");
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng voucher:", error);
      message.error("Có lỗi xảy ra khi áp dụng voucher!");
    }
  };

  // Thêm hàm xóa voucher
  const handleRemoveVoucher = () => {
    setVoucherCode("");
    setAppliedVoucher(null);
    setOrder((prev) => ({
      ...prev,
      voucherDiscount: 0,
    }));
    message.success("Đã xóa voucher!");
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    // Tạo đối tượng shippingAddress với thông tin người đặt
    let shippingAddressData = {
      address: selectedAddress,
    };

    // Nếu đặt cho người khác, thêm thông tin người nhận
    if (isOtherRecipient) {
      if (!recipientName || !recipientPhone || !recipientAddress) {
        message.error("Vui lòng điền đầy đủ thông tin người nhận.");
        return;
      }

      if (!validatePhoneNumber(recipientPhone)) {
        message.error(
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng!"
        );
        return;
      }

      console.log(shippingAddressData.senderEmail, 999999);

      shippingAddressData = {
        ...shippingAddressData,
        recipientName: recipientName,
        recipientPhone: recipientPhone,
        recipientAddress: recipientAddress,
      };
    }

    // Cập nhật order với thông tin shipping mới
    order.shippingAddress = shippingAddressData;

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
              voucherDiscount,
              voucherCode,
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
            voucherDiscount,
            voucherCode,
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

              voucherCode,
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
    refetch();
  };

  if (!order) return null;

  const updatePhone = () => {
    setIsUpdatePhone(!isUpdatePhone);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 md:p-8">
      <Card className="shadow-lg" bordered>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            {!isOtherRecipient ? (
              // Hiển thị thông tin người đặt khi không chọn gửi cho người khác
              <Card title="Thông tin người đặt hàng" size="small">
                <Text>
                  <strong>Tên:</strong> {user?.name}
                </Text>
                <br />
                <Text>
                  <strong>Email:</strong> {user?.email}
                </Text>
                <br />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="my-2"
                  onClick={() => handleOpenModal()}
                >
                  Thêm địa chỉ
                </Button>
                <div>
                  <strong style={{ whiteSpace: "nowrap" }}>Địa chỉ:</strong>
                  <Select
                    className="w-full text-lg h-10 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
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
              </Card>
            ) : (
              // Hiển thị form người nhận khi chọn gửi cho người khác
              <Card title="Thông tin người nhận" size="small">
                <div className="mb-4">
                  <label className="block mb-2">Tên người nhận:</label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nhập tên người nhận"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">
                    Số điện thoại người nhận:
                  </label>
                  <Input
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Địa chỉ người nhận:</label>
                  <Select
                    className="w-full text-lg h-12 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    value={recipientAddress}
                    onChange={(value) => setRecipientAddress(value)}
                    size="large"
                  >
                    {data?.addresses?.map((addr, idx) => (
                      <Select.Option key={idx} value={addr.address}>
                        {addr.address}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Card>
            )}

            {/* Toggle button luôn hiển thị */}
            <div className="mt-4">
              <Button
                type={isOtherRecipient ? "primary" : "default"}
                onClick={() => setIsOtherRecipient(!isOtherRecipient)}
                className="w-full"
              >
                {isOtherRecipient
                  ? "Đặt hàng cho bản thân"
                  : "Đặt hàng cho người khác"}
              </Button>
            </div>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Card title="Phương thức vận chuyển" size="small">
                <Select
                  value={selectedShippingMethod}
                  onChange={handleShippingChange}
                  style={{ width: "100%" }}
                >
                  {shippingOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label} - {option.fee.toLocaleString("vi-VN")} VNĐ
                    </Option>
                  ))}
                </Select>
              </Card>

              <Card title="Phương thức thanh toán">
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Space direction="vertical" size="small">
                    <Radio value="WALLET">Thanh toán từ ví</Radio>
                    <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                    <Radio value="ATM_MOMO">Chuyển khoản ATM MOMO</Radio>
                    <Radio value="QR_MOMO">Quét mã QR MoMo</Radio>
                  </Space>
                </Radio.Group>
              </Card>
              <Card title="Các mã giảm giá có thể sử dụng:" size="small">
                <div className="mt-4">
                  <div className="mt-2 space-y-2">
                    {availableVouchers?.map((voucher) => (
                      <div
                        key={voucher._id}
                        className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                        onClick={() => setVoucherCode(voucher.code)}
                      >
                        <div>
                          <Text strong>{voucher.code}</Text>
                          <br />
                          <Text type="secondary">
                            {voucher.description ||
                              `Giảm ${
                                voucher.type === "percentage"
                                  ? `${voucher.value}%`
                                  : `${voucher.value.toLocaleString("vi-VN")}đ`
                              }`}
                          </Text>
                        </div>
                        <Button
                          size="small"
                          type="link"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVoucherCode(voucher.code);
                            handleApplyVoucher();
                          }}
                        >
                          Áp dụng
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Space>
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
                      <strong>Giá:</strong>{" "}
                      {(product.price * product.quantity).toLocaleString()} VNĐ
                    </Text>
                  </div>
                ))}
              <Row gutter={24} className="mt-5">
                <Col span={24}>
                  <Card title="Mã giảm giá">
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={voucherCode}
                        onChange={(e) =>
                          setVoucherCode(e.target.value.toUpperCase())
                        }
                        disabled={appliedVoucher}
                        style={{ width: "calc(100% - 120px)" }}
                      />
                      {!appliedVoucher ? (
                        <Button type="primary" onClick={handleApplyVoucher}>
                          Áp dụng
                        </Button>
                      ) : (
                        <Button danger onClick={handleRemoveVoucher}>
                          Xóa
                        </Button>
                      )}
                    </Space.Compact>

                    {appliedVoucher && (
                      <div className="mt-3 p-2 bg-green-50 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <Text strong className="text-green-600">
                              Voucher đã áp dụng: {appliedVoucher.code}
                            </Text>
                            <br />
                            <Text type="secondary">
                              {appliedVoucher.type === "percentage"
                                ? `Giảm ${
                                    appliedVoucher.value
                                  }% (tối đa ${appliedVoucher.maxDiscount.toLocaleString(
                                    "vi-VN"
                                  )}đ)`
                                : `Giảm ${appliedVoucher.value.toLocaleString(
                                    "vi-VN"
                                  )}đ`}
                            </Text>
                          </div>
                          <Text type="success" strong>
                            -{order.voucherDiscount?.toLocaleString("vi-VN")}đ
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Hiển thị các voucher có sẵn */}
                    {/* <div className="mt-4">
                      <Text strong>Các mã giảm giá có thể sử dụng:</Text>
                      <div className="mt-2 space-y-2">
                        {availableVouchers?.map((voucher) => (
                          <div
                            key={voucher._id}
                            className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                            onClick={() => setVoucherCode(voucher.code)}
                          >
                            <div>
                              <Text strong>{voucher.code}</Text>
                              <br />
                              <Text type="secondary">
                                {voucher.description ||
                                  `Giảm ${
                                    voucher.type === "percentage"
                                      ? `${voucher.value}%`
                                      : `${voucher.value.toLocaleString(
                                          "vi-VN"
                                        )}đ`
                                  }`}
                              </Text>
                            </div>
                            <Button
                              size="small"
                              type="link"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVoucherCode(voucher.code);
                                handleApplyVoucher();
                              }}
                            >
                              Áp dụng
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </Card>
                </Col>
              </Row>
              <Divider />
              <Text>
                <strong>Tổng giá sản phẩm: </strong> {rawTotal.toLocaleString()}{" "}
                VNĐ
              </Text>
              <br />
              <Text>
                <strong>Phí vận chuyển:</strong> {shippingFee.toLocaleString()}{" "}
                VNĐ
              </Text>
              <br />
              <Text>
                <strong>Giảm giá:</strong> {voucherDiscount.toLocaleString()}{" "}
                VNĐ
              </Text>

              <br />
              <Title level={4} className="mt-2">
                Tổng giá cuối cùng: {finalTotal.toLocaleString()} VNĐ
              </Title>
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
