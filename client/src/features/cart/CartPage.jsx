import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Button, InputNumber, Typography, Row, Col, Image } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const initialCart = [
  { id: 1, name: "Adidas", size: "41", color: "Grey", price: 499, quantity: 1 },
  { id: 2, name: "Sneakers", size: "42", color: "White", price: 1299, quantity: 1 },
  { id: 1, name: "Adidas", size: "41", color: "Grey", price: 499, quantity: 2 },
];

const mergeCartItems = (cartItems) => {
  const mergedCart = {};
  cartItems.forEach((item) => {
    const key = `${item.id}-${item.size}-${item.color}`;
    if (mergedCart[key]) {
      mergedCart[key].quantity += item.quantity;
    } else {
      mergedCart[key] = { ...item };
    }
  });
  return Object.values(mergedCart);
};

const CartPage = () => {
  const [cart, setCart] = useState(mergeCartItems(initialCart));

  const updateQuantity = (key, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        `${item.id}-${item.size}-${item.color}` === key ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (key) => {
    setCart((prevCart) => prevCart.filter((item) => `${item.id}-${item.size}-${item.color}` !== key));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ backgroundColor: "#eee", padding: "20px" }}>
      <Row justify="center">
        <Col span={20}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <Title level={2} >Giỏ hàng của bạn</Title>
            <Text>Sort by: <a href="#!">price ▼</a></Text>
          </div>

          {cart.map((item) => {
            const key = `${item.id}-${item.size}-${item.color}`;
            return (
              <Card key={key} style={{ marginBottom: "15px" }}>
                <Row align="middle" gutter={16}>
                  <Col span={4}>
                    <Image width={80} src="https://img.freepik.com/free-psd/shoes-sale-social-media-post-square-banner-template-design_505751-4338.jpg?t=st=1739027840~exp=1739031440~hmac=f34962d4b382c4b62f583575a79d3c8977bccb8afea92430e32052f5b932b75c&w=826" alt={item.name} />
                  </Col>
                  <Col span={7}>
                    <Title level={5}>{item.name}</Title>
                    <Text>Size: {item.size} | Color: {item.color}</Text>
                  </Col>
                  <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                    <Button icon={<MinusOutlined />} onClick={() => updateQuantity(key, Math.max(1, item.quantity - 1))} />
                    <InputNumber min={1} value={item.quantity} onChange={(value) => updateQuantity(key, value)} style={{ margin: "0 10px" }} />
                    <Button icon={<PlusOutlined />} onClick={() => updateQuantity(key, item.quantity + 1)} />
                  </Col>
                  <Col span={4}>
                    <Title level={5}>{item.price * item.quantity} VNĐ</Title>
                  </Col>
                  <Col span={2}>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(key)} />
                  </Col>
                </Row>
              </Card>
            );
          })}

          <Card style={{ borderRadius: "10px", textAlign: "right" }}>
            <Title level={4}>Tổng tiền: {totalPrice} VNĐ</Title>
            <Link to="/cart/checkout">
              <Button type="primary" size="large">Thanh toán</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
