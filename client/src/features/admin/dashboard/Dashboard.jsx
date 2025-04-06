import React from "react";
import StatisticsComponent from "./StatisticsComponent";
import RevenueChart from "./RevenueChart";
import ProductComparisonChart from "./ProductComparisonChart";
import { Divider, Typography } from "antd";

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
      <Title level={2}>Bảng điều khiển</Title>
      
      {/* Revenue Chart */}
      <div style={{ marginBottom: "24px" }}>
        <RevenueChart />
      </div>
      
      <Divider />
      
      {/* Product Comparison Chart */}
      <div style={{ marginBottom: "24px" }}>
        <ProductComparisonChart />
      </div>
      
      <Divider />
      
      {/* Original Statistics Component */}
      <div>
        <StatisticsComponent />
      </div>
    </div>
  );
};

export default Dashboard;