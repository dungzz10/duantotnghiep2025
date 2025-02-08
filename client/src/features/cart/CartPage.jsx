import React from 'react';
import { Link } from "react-router-dom";
import { Card, Button, InputNumber, Typography, Row, Col, Image } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const CartPage = () => {
  return (
    <div style={{ backgroundColor: "#eee", padding: "20px" }}>
      <Row justify="center">
        <Col span={20}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <Title level={2}>Shopping Cart</Title>
            <Text>
              Sort by: <a href="#!">price ▼</a>
            </Text>
          </div>

          {[1, 2, 3, 4, 5].map((item) => (
            <Card key={item} style={{ marginBottom: "15px" }}>
              <Row align="middle" gutter={16}>
                <Col span={4}>
                  <Image
                    width={80}
                    src="https://img.freepik.com/free-psd/shoes-sale-social-media-post-square-banner-template-design_505751-4338.jpg?t=st=1739027840~exp=1739031440~hmac=f34962d4b382c4b62f583575a79d3c8977bccb8afea92430e32052f5b932b75c&w=826"
                    alt="Cotton T-shirt"
                  />
                </Col>
                <Col span={7}>
                  <Title level={5}>Basic T-shirt</Title>
                  <Text>Size: M | Color: Grey</Text>
                </Col>
                <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                  <Button icon={<MinusOutlined />} />
                  <InputNumber min={0} defaultValue={1} style={{ margin: "0 10px" }} />
                  <Button icon={<PlusOutlined />} />
                </Col>
                <Col span={4}>
                  <Title level={5}>$499.00</Title>
                </Col>
                <Col span={2}>
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Col>
              </Row>
            </Card>
          ))}

          <Card style={{ marginBottom: "15px" }}>
            <Row>
              <Col flex="auto">
                <InputNumber placeholder="Discount code" style={{ width: "100%" }} />
              </Col>
              <Col flex="none">
                <Button type="primary" style={{ marginLeft: "10px" }}>Apply</Button>
              </Col>
            </Row>
          </Card>

          <Card style={{ borderRadius: "10px", textAlign: "right" }}>
            <Link to= "/cart/checkout">
            <Button type="primary" size="large">Checkout</Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartPage