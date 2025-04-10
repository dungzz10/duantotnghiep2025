/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Select,
  Tag,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  DatePicker,
  Rate,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CloseOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import moment from "moment";

const { Option } = Select;

const Order = () => {
  const { RangePicker } = DatePicker;

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPhoneUser, setSearchPhoneUser] = useState("");
  const [searchPhoneRecipient, setSearchPhoneRecipient] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);

  const handleSearchPhoneUser = async () => {
    if (!searchPhoneUser && !searchPhoneRecipient) {
      message.warning("Vui lòng nhập số điện thoại người gửi hoặc người nhận");
      return;
    }
    try {
      if (searchPhoneUser) {
        const response = await axios.get(
          `/orders/userPhone-check/${searchPhoneUser}`
        );
        setOrders(response.data.data);
      }
      if (searchPhoneRecipient) {
        const response = await axios.get(
          `/orders/recipientPhone-check/${searchPhoneRecipient}`
        );
        setOrders(response.data.data);
      }
    } catch (error) {
      if (error.response.data.message === "SO_DIEN_THOAI_CHUA_DUOC_DANG_KI") {
        message.error("Số điện thoại chưa có ai đăng ký");
      } else {
        message.error("Có lỗi xảy ra khi tìm kiếm.");
      }
    }
  };

  const fetchStatistics = async () => {
    try {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      const ordersResponse = await axios.get(
        `http://localhost:5000/api/v1/thongke/order-statistics?startDate=${startDate}&endDate=${endDate}`
      );
      setSearchPhoneUser("");
      setOrders(ordersResponse.data.orders);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const isAdmin = userInfo?.role === "admin";
      const response = await axios.get(
        `/orders/?adminView=${isAdmin ? "false" : "true"}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const normalizedOrders = response.data.orders.map((order) => ({
        ...order,
        products: order.products || [],
        shippingFee: order.shippingFee || 0,
        voucherDiscount: order.voucherDiscount || 0,
        finalTotal: order.finalTotal || 0,
      }));
      setOrders(normalizedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Có lỗi xảy ra khi tải đơn hàng.");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const matchesSearch =
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.userId?.name &&
            order.userId.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          order.products.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesStatus =
          selectedStatus === "All" || order.orderStatus === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .map((order, index) => ({ ...order, idx: index + 1 }));
  }, [orders, searchTerm, selectedStatus]);

  const getStatusTag = (orderStatus) => {
    const statusMap = {
      delivered: { color: "green", text: "Đã giao" },
      pending: { color: "orange", text: "Chưa thanh toán" },
      processing: { color: "orange", text: "Đang xử lý" },
      shipped: { color: "orange", text: "Đang vận chuyển" },
      cancelled: { color: "red", text: "Đã hủy" },
      trahang: { color: "purple", text: "Hoàn hàng" },
    };
    const { color, text } = statusMap[orderStatus] || {
      color: "default",
      text: orderStatus,
    };
    return <Tag color={color}>{text}</Tag>;
  };

  const paymentStatusMap = {
    pending: "Chưa thanh toán",
    completed: "Đã thanh toán",
    failed: "Thất bại",
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/orders/orderStatus/${orderId}`, {
        orderStatus: "cancelled",
  });
      message.success(`Đơn ${orderId} đã được hủy.`);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi huỷ đơn:", error);
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`/orders/orderStatus/${orderId}`, {
        orderStatus: newStatus,
      });
      if (response.data.success) {
        message.success("Cập nhật trạng thái đơn hàng thành công.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleUpdate = async (orderId) => {
    try {
      const response = await axios.patch(`/orders/orderStatus/${orderId}`, {
        orderStatus: "delivered",
      });
      if (response.data.success) {
        message.success("Đơn hàng đã được cập nhật thành công.");
      } else {
        message.error("Có lỗi xảy ra khi cập nhật đơn hàng.");
      }
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      message.error("Có lỗi xảy ra khi cập nhật đơn hàng.");
    }
  };

  const columns = [
    { title: "#", dataIndex: "idx", key: "idx" },
    {
      title: "Tên khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (user) => user?.name || "Unknown",
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "firstProductName",
      render: (products) => products[0]?.name || "Không có sản phẩm",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `${amount.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: ["paymentMethod", "paymentStatus"],
      key: "payment",
      render: (text, record) =>
        record.paymentMethod && record.paymentStatus
          ? `${record.paymentMethod} (${
              paymentStatusMap[record.paymentStatus] || record.paymentStatus
            })`
          : "Không xác định",
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Select
            value={status}
            onChange={(value) => {
              setOrders((prevOrders) =>
                prevOrders.map((order) =>
                  order._id === record._id ? { ...order, orderStatus: value } : order
                )
              );
            }}
            style={{ width: 150 }}
            disabled={record.orderStatus === "cancelled"}
          >
            <Option value="pending">Chưa thanh toán</Option>
            <Option value="processing">Đang xử lý</Option>
            <Option value="shipped">Đang vận chuyển</Option>
            <Option value="delivered">Đã giao</Option>
            <Option value="cancelled">Đã huỷ</Option>
            <Option value="trahang">Đã hoàn Hàng</Option>
          </Select>
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpdateStatus(record._id, record.orderStatus)}
          >
            Cập nhật
          </Button>
        </div>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (date ? format(new Date(date), "dd/MM/yyyy") : "N/A"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.orderStatus === "shipped" && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(record._id)}
            >
              Đã giao
            </Button>
          )}
          {record.orderStatus !== "cancelled" &&
            record.orderStatus !== "trahang" && (
              <Popconfirm
                title="Xoá đơn ?"
                onConfirm={() => handleCancelOrder(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<CloseOutlined />}>
                  Huỷ đơn
                </Button>
              </Popconfirm>
            )}
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedOrder(record)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    }
  };

  const handleFilter = () => {
    setSearchPhoneUser("");
    fetchStatistics();
  };

  const productColumns = [
    {
      title: "Product Details",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.image || "placeholder_image_url"}
            alt={record.name || "Unknown"}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "10px",
              borderRadius: "4px",
            }}
          />
          <div>
            <div style={{ fontWeight: "500" }}>{record.name || "Không có tên"}</div>
            <div style={{ color: "#888", fontSize: "12px" }}>
              Color: {record.color || "Không xác định"}
            </div>
            <div style={{ color: "#888", fontSize: "12px" }}>
              Size: {record.size || "Không xác định"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusMap = {
          delivered: { color: "green", text: "Đã giao" },
          pending: { color: "orange", text: "Chưa xử lý" },
          processing: { color: "orange", text: "Đang xử lý" },
          shipped: { color: "orange", text: "Đang vận chuyển" },
          cancelled: { color: "red", text: "Đã Huỷ" },
          trahang: { color: "purple", text: "Đã hoàn" },
        };
        const { color, text } = statusMap[status] || {
          color: "default",
          text: status.toUpperCase(),
        };
        return (
          <Tag color={color} style={{ borderRadius: "12px", padding: "2px 8px" }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        date ? format(new Date(date), "HH:mm dd/MM/yyyy ") : "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "",
      key: "actions",
      render: () => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="text"
            icon={<CheckCircleOutlined style={{ color: "green" }} />}
            style={{ padding: 0 }}
          />
          <Button
            type="text"
            icon={<CloseCircleOutlined style={{ color: "red" }} />}
            style={{ padding: 0 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Phần danh sách đơn hàng - ẩn khi có selectedOrder */}
      {!selectedOrder && (
        <>
          <h2>Quản lý đơn hàng</h2>
          <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
            <Input
              placeholder="Tìm kiếm đơn hàng"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "250px" }}
            />
            <Select
              defaultValue="All"
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: "150px" }}
            >
              <Option value="All">Tất cả</Option>
              <Option value="pending">Chưa thanh toán</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipped">Đang vận chuyển</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="trahang">Đã Trả Hàng</Option>
            </Select>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
              <Input
                placeholder="Số điện thoại người đặt"
                prefix={<SearchOutlined />}
                value={searchPhoneUser}
                onChange={(e) => setSearchPhoneUser(e.target.value)}
                style={{ width: "250px" }}
              />
              <Button
                type="primary"
                onClick={handleSearchPhoneUser}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
            <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
              <Input
                placeholder="Số điện thoại người nhận"
                prefix={<SearchOutlined />}
                value={searchPhoneRecipient}
                onChange={(e) => setSearchPhoneRecipient(e.target.value)}
                style={{ width: "250px" }}
              />
              <Button
                type="primary"
                onClick={handleSearchPhoneUser}
                icon={<SearchOutlined />}
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
          <div>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              disabledDate={(current) => current && current > moment().endOf("day")}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              ranges={{
                "Hôm nay": [moment().startOf("day"), moment()],
                "7 ngày qua": [moment().subtract(7, "days"), moment()],
                "30 ngày qua": [moment().subtract(30, "days"), moment()],
                "Tháng này": [moment().startOf("month"), moment()],
              }}
            />
            <Button type="primary" onClick={handleFilter} style={{ marginLeft: 8 }}>
              Lọc
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="orderId"
            pagination={{ pageSize: 6 }}
            style={{ marginTop: "20px" }}
          />
        </>
      )}

      {/* Trang chi tiết sản phẩm - hiển thị khi có selectedOrder */}
      {selectedOrder && (
        <div style={{ padding: "20px" }}>
          <Button
            style={{ marginBottom: "20px" }}
            onClick={() => setSelectedOrder(null)}
          >
            Quay lại danh sách
          </Button>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <strong><h3 style={{ marginBottom: "16px" }}>Chi tiết sản phẩm</h3></strong>
                <p style={{ margin: "8px 0" }}>
                  <strong>Ngày đặt:</strong>{" "}
                  {format(new Date(selectedOrder.date), "dd/MM/yyyy")}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Dạng thanh toán:</strong>{" "}
                  {selectedOrder.paymentMethod || "Online"}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Kiểu Ship:</strong>
                </p>
              </div>
            </Col>

            <Col span={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <strong><h3 style={{ marginBottom: "16px" }}>Người đặt</h3></strong>
                <p style={{ margin: "8px 0"}}>
                  <strong>Tên:</strong> {selectedOrder.userId?.name}
                  <strong>Email:</strong> {selectedOrder.userId?.email}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Số điện thoại:</strong> {selectedOrder.userId?.phoneNumber}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Contact:</strong>{" "}
                  {selectedOrder.userId?.phoneNumber}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <strong><h3 style={{ marginBottom: "16px" }}>Người nhận</h3></strong>
                <p style={{ margin: "8px 0" }}>
                  <strong>Tên:</strong> {selectedOrder.shippingAddress.recipientName ||
                            selectedOrder.userId.name}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Số điện thoại:</strong> {selectedOrder.shippingAddress.recipientPhone ||
                            selectedOrder.userId.phoneNumber}
                </p>
                <p style={{ margin: "8px 0" }}>
                  <strong>Địa chỉ:</strong>{" "}
                  {selectedOrder.shippingAddress.recipientAddress}
                </p>
              </div>
            </Col>
            <Col span={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <strong><h3 style={{ marginBottom: "16px" }}>Trạng thái đơn hàng</h3></strong>
                <p style={{ margin: "8px 0" }}>
                  <strong>Trạng thái đơn hàng:</strong>{" "}
                  {selectedOrder.orderStatus && getStatusTag(selectedOrder.orderStatus)}
                </p>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "16px" }}>
              Order: {selectedOrder.orderId}
            </h3>
            <Table
              columns={productColumns}
              dataSource={selectedOrder.products.map((product) => ({
                ...product,
                orderStatus: selectedOrder.orderStatus,
                date: selectedOrder.date, 
              }))}
              rowKey={(record, index) => index}
              pagination={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;