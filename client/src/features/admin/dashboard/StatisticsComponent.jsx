import { useState, useEffect } from "react";
import {
  Typography,
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
import {
  ShoppingCartOutlined,
  UserOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN"; // Import locale tiếng Việt

const { RangePicker } = DatePicker;
const { Title } = Typography;

const StatisticsComponent = () => {
  const [loading, setLoading] = useState(false);
  // Thiết lập khoảng thời gian mặc định là 30 ngày trước đến hiện tại
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    successRate: 0,
    topUsers: [],
    topProducts: [],
  });

  // Gọi API khi khoảng thời gian thay đổi
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchStatistics();
    }
  }, [dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Nếu không có khoảng thời gian, lấy 30 ngày gần nhất
      const startDate = dateRange
        ? dateRange[0].format("YYYY-MM-DD")
        : moment().subtract(30, "days").format("YYYY-MM-DD");
      const endDate = dateRange
        ? dateRange[1].format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      // Gọi API lấy dữ liệu thống kê
      const [
        ordersResponse,
        successRateResponse,
        topUsersResponse,
        topProductsResponse,
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
      ]);

      // Xử lý dữ liệu trả về
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

      setStats({
        totalOrders,
        successRate,
        topUsers,
        topProducts,
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(stats.topUsers);
  // Xử lý sự kiện khi người dùng thay đổi khoảng thời gian
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  // Cấu hình cho bảng top người dùng
  const userColumns = [
    {
      title: "Top",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name", // Thay đổi từ _id sang name
      key: "userName",
      render: (name, record) =>
        name ||
        (record._id?.length > 10
          ? `${record._id.substring(0, 10)}...`
          : record._id || "Không có tên"),
    },
    {
      title: "Số đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
  ];

  // Cấu hình cho bảng top sản phẩm
  const productColumns = [
    {
      title: "Top",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title", // Thay đổi từ _id sang title
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

  return (
    <div className="statistics-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="date-filter">
          <Title level={4}>Thống kê dữ liệu</Title>
          {/* PHƯƠNG ÁN 1: Nếu muốn giữ RangePicker nhưng sửa lỗi */}
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current > moment().endOf("day")
            }
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            locale={locale}
            style={{ width: 300 }}
            ranges={{
              "Hôm nay": [moment().startOf("day"), moment()],
              "7 ngày qua": [moment().subtract(7, "days"), moment()],
              "30 ngày qua": [moment().subtract(30, "days"), moment()],
              "Tháng này": [moment().startOf("month"), moment()],
            }}
          />

          {/* PHƯƠNG ÁN 2: Nếu muốn xóa RangePicker và thay thế bằng nút lọc đơn giản */}

          <Space>
            <Button
              onClick={() =>
                setDateRange([moment().subtract(7, "days"), moment()])
              }
            >
              7 ngày qua
            </Button>
            <Button
              onClick={() =>
                setDateRange([moment().subtract(30, "days"), moment()])
              }
            >
              30 ngày qua
            </Button>
            <Button
              onClick={() =>
                setDateRange([moment().startOf("month"), moment()])
              }
            >
              Tháng này
            </Button>
          </Space>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Thẻ thống kê tổng quan */}
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
            </Row>

            {/* Bảng thống kê top người dùng */}
            <Card title="Top 10 khách hàng đặt nhiều nhất">
              <Table
                dataSource={stats.topUsers}
                columns={userColumns}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            </Card>

            {/* Bảng thống kê top sản phẩm */}
            <Card title="Top 10 sản phẩm bán chạy nhất">
              <Table
                dataSource={stats.topProducts}
                columns={productColumns}
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
