import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  InputNumber,
  Typography,
  Row,
  Col,
  Image,
  Checkbox,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import EmptyCart from "./EmptyCart";
import { add } from "date-fns";

const { Title, Text } = Typography;

const CartPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.removeItem("cart");
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setSelectedItems(new Array(storedCart.length).fill(false));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentSuccess = queryParams.get("success");

    if (paymentSuccess === "true") {
      message.success("Thanh toán thành công! Đang trở về giỏ hàng...");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/cart");
    } else if (paymentSuccess === "false") {
      message.error("Thanh toán thất bại! Vui lòng thử lại.");
    }
  }, [navigate]);

  const updateQuantity = (index, newQuantity) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const toggleSelectItem = (index) => {
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = !updatedSelectedItems[index];
    setSelectedItems(updatedSelectedItems);
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedItems(cart.map(() => newSelectAll));
  };

  const deleteSelectedItems = () => {
    const updatedCart = cart.filter((_, index) => !selectedItems[index]);
    setCart(updatedCart);
    setSelectedItems(new Array(updatedCart.length).fill(false));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const selectedProducts = cart.filter((_, index) => selectedItems[index]);

  const shippingFee = 30000;
  const totalPrice =
    cart.reduce(
      (sum, item, index) =>
        sum + (selectedItems[index] ? item.price * item.quantity : 0),
      0
    ) + (selectedProducts.length > 0 ? shippingFee : 0);

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const formattedProducts = selectedProducts.map(product => ({
      productId: product.id, 
      name: product.title,
      price: product.price,
      title: product.title,
      color: product.color,
      size: product.size,
      quantity: product.quantity,
      totalPrice: product.price * product.quantity,
      image: product.image,
    }));
    const amount = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
        shippingAddress: {
          address: "Hà Nội",
          addressType: "home",
        },
      },
      products: formattedProducts, 
      amount,
      total: totalPrice,
      shippingFee,
      finalTotal: totalPrice,
      
    };
    localStorage.setItem("order", JSON.stringify(orderData));
    navigate("/cart/checkout");
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="w-full md:py-20 bg-white">
      <Row justify="center">
        <Col span={20}>
          <Title level={2} className="text-center mb-5">
            Shopping Cart
          </Title>

          <Row gutter={24} className="py-10">
            <Col span={24}>
              <Row className="border-b pb-3" align="middle" gutter={16}>
                <Col span={1}>
                  <Checkbox checked={selectAll} onChange={toggleSelectAll} />
                </Col>
                <Col span={3}>
                  <Text className="text-lg font-medium">Ảnh</Text>
                </Col>
                <Col span={6}>
                  <Text className="text-lg font-medium">Sản Phẩm</Text>
                </Col>
                <Col span={3}>
                  <Text className="text-lg font-medium">Đơn Giá</Text>
                </Col>
                <Col span={4}>
                  <Text className="text-lg font-medium">Số Lượng</Text>
                </Col>
                <Col span={3}>
                  <Text className="text-lg font-medium">Số Tiền</Text>
                </Col>
                <Col span={2}>
                  <Text className="text-lg font-medium">Thao Tác</Text>
                </Col>
              </Row>
              {cart.map((item, index) => (
                <Row
                  key={index}
                  align="middle"
                  gutter={16}
                  className="py-2 border-b"
                >
                  <Col span={1}>
                    <Checkbox
                      checked={selectedItems[index]}
                      onChange={() => toggleSelectItem(index)}
                    />
                  </Col>
                  <Col span={3}>
                    <Image
                      width={80}
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.title}
                    />
                  </Col>
                  <Col span={6}>
                    <Title level={5}>{item.title}</Title>
                  </Col>
                  <Col span={3}>
                    <Text>{item.price} VNĐ</Text>
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(index, value || 1)}
                      className="mx-2"
                    />
                  </Col>
                  <Col span={3}>
                    <Text>{item.price * item.quantity} VNĐ</Text>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(index)}
                    />
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>

          <div className="flex justify-between items-center border-t pt-3">
            <Checkbox checked={selectAll} onChange={toggleSelectAll}>
              Chọn Tất Cả ({cart.length})
            </Checkbox>
            <Button
              type="text"
              danger
              onClick={deleteSelectedItems}
              disabled={!selectedItems.includes(true)}
            >
              Xóa
            </Button>
            <Text className="font-medium">
              Tổng thanh toán ({selectedProducts.length} Sản phẩm):{" "}
              <span className="text-red-500">{totalPrice} VNĐ</span>
            </Text>
            <Text className="text-gray-500">
              (Bao gồm phí vận chuyển: {shippingFee} VNĐ)
            </Text>
            <Button
              type="primary"
              size="large"
              className="bg-red-500 text-white rounded-lg"
              disabled={totalPrice === 0}
              onClick={handleCheckout}
            >
              Mua Hàng
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
