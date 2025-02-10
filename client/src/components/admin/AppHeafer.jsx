import React from "react";
import { Typography, Image, Space, Badge } from "antd";

const AppHeafer = () => {
  return (
    <div className="h-[50px] flex justify-between align-middle p-4 border-b-gray-100">
      <Image
        width={40}
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fduantotnghiep2025%2F&psig=AOvVaw3Q6Z9Q6Q6Z9Q6"
      ></Image>
      <Typography.Title level={3}>Admin</Typography.Title>
      <Space>
        <Badge>Mail</Badge>
      </Space>
    </div>
  );
};

export default AppHeafer;
