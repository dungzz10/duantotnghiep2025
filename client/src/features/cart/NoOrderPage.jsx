import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";

const { Title, Text } = Typography;

const NoOrderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center space-y-2">
      <Title level={2} className="text-red-500">Không có đơn hàng cần thanh toán!</Title>
      <Text className="text-gray-600">Hiện tại không có đơn hàng nào trong hệ thống của bạn.</Text>
      <Button type="primary" className="bg-blue-500 text-white" onClick={() => navigate("/")}>Quay về trang chủ</Button>
    </div>
  );
};

export default NoOrderPage;
