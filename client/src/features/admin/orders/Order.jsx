/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Select,
  Tag,
  Modal,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  DatePicker,
} from "antd";
import { SearchOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons"; // Thêm EditOutlined
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState(
    selectedOrder?.orderStatus || "pending"
  );
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
      // Nếu có số điện thoại người gửi, tìm kiếm theo số điện thoại người gửi
      if (searchPhoneUser) {
        const response = await axios.get(
          `/orders/userPhone-check/${searchPhoneUser}`
        );
        setOrders(response.data.data);
      }

      // Nếu có số điện thoại người nhận, tìm kiếm theo số điện thoại người nhận
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
      console.log(startDate, endDate, 666);

      const ordersResponse = await axios.get(
        `http://localhost:5000/api/v1/thongke/order-statistics?startDate=${startDate}&endDate=${endDate}`
      );
      console.log(ordersResponse, 999);
      setSearchPhoneUser("");
      setOrders(ordersResponse.data.orders);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  console.log("selectedOrder", selectedOrder);
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
      ``;
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
      trahang: { color: "purple", text: "Hoàn  hàng" },
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

  const handleUpdateStatus = async () => {
    try {
      await axios.patch(`/orders/orderStatus/${selectedOrder._id}`, {
        orderStatus: editingStatus,
      });
      fetchOrders();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
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
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => {
        return date ? format(new Date(date), "dd/MM/yyyy") : "N/A";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
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
            onClick={() => {
              setSelectedOrder(record);
              setEditingStatus(record.orderStatus);
              setIsModalVisible(true);
            }}
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý đơn hàng</h2>
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Search orders..."
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
          <Option value="trahang">Đã Trả Hàng </Option>
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
      />

      {/* Modal để hiển thị chi tiết đơn hàng */}
      <Modal
        title="Chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedOrder?.orderStatus !== "cancelled"
            ? [
                <Button key="save" type="primary" onClick={handleUpdateStatus}>
                  Lưu
                </Button>,
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="close" onClick={() => setIsModalVisible(false)}>
                  Đóng
                </Button>,
              ]
        }
        width="80%"
        style={{ top: 40 }}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong>ID Đơn Hàng:</strong> {selectedOrder.orderId}
                </p>
                <p>
                  <strong>Ngày đặt:</strong>{" "}
                  {format(new Date(selectedOrder.date), "HH:mm:ss MM/dd/yyyy ")}
                </p>
                <p>
                  <strong>Trạng thái:</strong>
                  <Select
                    value={editingStatus}
                    onChange={setEditingStatus}
                    disabled={selectedOrder.orderStatus === "cancelled"}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    <Option value="pending">Chưa thanh toán</Option>
                    <Option value="processing">Đang xử lý</Option>
                    <Option value="shipped">Đang vận chuyển</Option>
                    <Option value="delivered">Đã giao</Option>
                    <Option value="cancelled">Đã huỷ</Option>
                    <Option value="trahang">Hoàn Hàng </Option>
                  </Select>
                </p>
              </Col>

              <Col span={12}>
                <div>
                  <h2>
                    <strong>Thông tin khách hàng:</strong>
                  </h2>
                  {selectedOrder.userId && (
                    <div style={{ marginBottom: "15px" }}>
                      <p>
                        <strong>Tên:</strong> {selectedOrder.userId.name}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong>{" "}
                        {selectedOrder.userId.phoneNumber}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedOrder.userId.email}
                      </p>
                      <p>
                        <strong>Giới thiệu:</strong>{" "}
                        {selectedOrder.userId.introduction || "Không có"}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong>
                        {selectedOrder.shippingAddress.addressType}{" "}
                        {selectedOrder.shippingAddress.address}
                      </p>
                    </div>
                  )}
                  {selectedOrder.shippingAddress &&
                  selectedOrder.shippingAddress.recipientName ? (
                    <>
                      <h2>
                        <strong>Thông tin người nhận:</strong>
                      </h2>
                      <div style={{ marginBottom: "15px" }}>
                        <p>
                          <strong>Tên người nhận:</strong>{" "}
                          {selectedOrder.shippingAddress.recipientName ||
                            selectedOrder.userId.name}
                        </p>
                        <p>
                          <strong>Số điện thoại người nhận:</strong>{" "}
                          {selectedOrder.shippingAddress.recipientPhone ||
                            selectedOrder.userId.phoneNumber}
                        </p>
                        <p>
                          <strong>Địa chỉ người nhận:</strong>{" "}
                          {selectedOrder.shippingAddress.recipientAddress}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
              </Col>
            </Row>

            <h2>
              <strong>Sản phẩm trong đơn hàng:</strong>
            </h2>
            <div
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              {selectedOrder.products &&
                selectedOrder.products.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      border: "1px solid #f0f0f0",
                      borderRadius: "10px",
                      padding: "10px",
                      width: "calc(33.33% - 15px)", // Chia đều 3 cột
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={item.image || "placeholder_image_url"}
                      alt={item.name || "Unknown"}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Tên:</strong> {item.name || "Không có tên"}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Màu sắc:</strong>{" "}
                        {item.color || "Không xác định"}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Số lượng:</strong> {item.quantity || 0}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Kích thước:</strong>{" "}
                        {item.size || "Không xác định"}
                      </p>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Giá:</strong>{" "}
                        {item.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <p>
                  <strong>Phí vận chuyển:</strong>{" "}
                  {selectedOrder.shippingFee.toLocaleString("vi-VN")} VNĐ
                </p>
              </Col>
              <Col span={12}>
                <p>
                  <strong>Giảm giá Voucher:</strong>{" "}
                  {selectedOrder.voucherDiscount.toLocaleString("vi-VN")} VNĐ
                </p>
              </Col>
            </Row>
            <p>
              <strong>Tổng tiền cuối cùng:</strong>{" "}
              {selectedOrder.finalTotal.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Order;
