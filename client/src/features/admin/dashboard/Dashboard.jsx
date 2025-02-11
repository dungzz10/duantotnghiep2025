import { AppstoreOutlined, DatabaseOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Space, Statistic, Typography, Card } from "antd";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={<ShoppingCartOutlined style={{ fontSize: 24, color:"green" ,borderRadius:20, fontSize:24 ,p:8  }} />}
          title="Total Orders"
          value={100}
        />
        <DashboardCard
          icon={<UserOutlined style={{ fontSize: 24, color:"green" ,borderRadius:20, fontSize:24 ,p:8  }} />}
          title="Total Users"
          value={100}
        />
        <DashboardCard
          icon={<DatabaseOutlined style={{ fontSize: 24, color:"green" ,borderRadius:20, fontSize:24 ,p:8  }} />}
          title="Total Products"
          value={100}
        />
        <DashboardCard
          icon={<AppstoreOutlined style={{ fontSize: 24, color:"green" ,borderRadius:20, fontSize:24 ,p:8  }} />}
          title="Total Inventory"
          value={100}
        />
      </Space>
    </div>
  );
};

function DashboardCard({ title, value, icon }) {
  return (
    <Card>
      <Space>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

export default Dashboard;
