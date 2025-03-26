import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography, // Đã có Typography ở đây
  Card,
  Space,
  Statistic,
  DatePicker,
  Row,
  Col,
  Table,
  Progress,
  Spin,
  Button,
} from "antd";
import { ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN"; // Import locale tiếng Việt
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle, // Đổi tên Title thành ChartTitle
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;
const { Title } = Typography; // Đây là Title từ 'antd', không bị trùng

const StatisticsComponent = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    successRate: 0,

    topUsers: [],
    topProducts: [],
    totalProfit: 0,
  });

  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchStatistics();
    }
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      const [
        ordersResponse,
        successRateResponse,
        topUsersResponse,

        topProductsResponse,
        totalProfit,
        topProductsSellResponse,
      ] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/v1/thongke/order-statistics?startDate=${startDate}&endDate=${endDate}`
        ),
        axios.get(
          `http://localhost:5000/api/v1/thongke/order-success-rate?startDate=${startDate}&endDate=${endDate}`
        ),
        axios.get(
          `http://localhost:5000/api/v1/thongke/top-users?startDate=${startDate}&endDate=${endDate}`
        ),
        axios.get(
          `http://localhost:5000/api/v1/thongke/top-products?startDate=${startDate}&endDate=${endDate}`
        ),
        axios.get(
          `http://localhost:5000/api/v1/thongke/profit?startDate=${startDate}&endDate=${endDate}`
        ),
        axios.get(
          `http://localhost:5000/api/v1/thongke/top-products-sell?startDate=${startDate}&endDate=${endDate}`
        ),
      ]);

      const totalOrders = ordersResponse.data.data[0]?.totalOrders || 0;

      const successRateData = successRateResponse.data.data[0] || {
        totalOrders: 0,
        successfulOrders: 0,
      };
      const successRate =
        successRateData.totalOrders > 0
          ? Math.round(
              (successRateData.successfulOrders / successRateData.totalOrders) *
                100
            )
          : 0;

      const topUsers = topUsersResponse.data.data || [];
      const topProducts = topProductsResponse.data.data || [];
      console.log("Top Products:", totalProfit);
      const totalProfitData = totalProfit.data.totalProfit || {
        totalProfit: 0,
      };
      const topProductsSell = topProductsSellResponse.data.data || [];
      console.log("Top Products:", topProductsSell);

      setStats({
        totalOrders,
        successRate,
        topUsers,
        topProducts,
        totalProfitData,
        topProductsSell,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    }
  };
  const chartData = {
    labels: stats.topProducts.map((product) => product.title),
    datasets: [
      {
        label: "Số lượng bán",
        data: stats.topProducts.map((product) => product.totalQuantity),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const userColumns = [
    {
      title: "Top",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "userName",
      render: (name, record) => {
        return <Link to={`/admin/detail/${record._id}`}>{name}</Link>;
      },
    },

    {
      title: "Số đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: "Số đơn hàng đặt Thành Công",
      dataIndex: "successfulOrders",
      key: "successfulOrders",
    },
  ];

  const productColumns = [
    {
      title: "Top",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "productTitle",
      render: (title, record) =>
        title ||
        (record._id?.length > 10
          ? `${record._id.substring(0, 10)}...`
          : record._id || "Không có tên"),
    },
    {
      title: "Số lượng bán",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
    },
  ];
  const productColumns2 = [
    {
      title: "Top",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (title, record) => {
        return <Link to={`/admin/products/detail/${record._id}`}>{title}</Link>;
      },
    },
    {
      title: "Thành Tiền ",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (text) => {
        return text.toLocaleString();
      },
    },

    {
      title: "Số lượng bán",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
    },
  ];

  return (
    <div className="statistics-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="date-filter">
          <Title level={4}>Thống kê dữ liệu</Title>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            } // Chặn ngày tương lai
            format="DD/MM/YYYY" // Định dạng ngày
            locale={{
              locale: "vi_VN", // Ngôn ngữ là tiếng Việt
            }}
            placeholder={["Từ ngày", "Đến ngày"]}
            ranges={{
              "Hôm nay": [moment().startOf("day"), moment()],
              "7 ngày qua": [moment().subtract(7, "days"), moment()],
              "30 ngày qua": [moment().subtract(30, "days"), moment()],
              "Tháng này": [moment().startOf("month"), moment()],
            }} // Cấu hình các phạm vi ngày
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Space>
                    <ShoppingCartOutlined
                      style={{ fontSize: 24, color: "green" }}
                    />
                    <Statistic
                      title="Tổng đơn hàng"
                      value={stats.totalOrders}
                    />
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card>
                  <Space>
                    <CheckCircleOutlined
                      style={{ fontSize: 24, color: "blue" }}
                    />
                    <Statistic
                      title="Tỷ lệ đơn hàng thành công"
                      value={stats.successRate}
                      suffix="%"
                      precision={1}
                    />
                    <Progress
                      percent={stats.successRate}
                      status={stats.successRate > 70 ? "success" : "normal"}
                      size="small"
                      style={{ width: 100 }}
                    />
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                {/* Thêm phần hiển thị tổng lợi nhuận */}
                <Card>
                  <Space>
                    <Statistic
                      title="Tổng Thu"
                      value={stats.totalProfitData}
                      prefix="₫"
                    />
                  </Space>
                </Card>
              </Col>
            </Row>

            <Card title="Top 10 sản phẩm bán chạy nhất">
              <Bar data={chartData} />
            </Card>

            <Card title="Top 10 khách hàng đặt nhiều nhất">
              <Table
                dataSource={stats.topUsers}
                columns={userColumns}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            </Card>

            <Card title="Top 10 sản phẩm bán chạy nhất">
              <Table
                dataSource={stats.topProducts}
                columns={productColumns}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            </Card>
            <Card title="Top 10 sản phẩm bán chạy nhất giao hàng thành công ">
              <Table
                dataSource={stats.topProductsSell}
                columns={productColumns2}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            </Card>
          </>
        )}
      </Space>
    </div>
  );
};

export default StatisticsComponent;
