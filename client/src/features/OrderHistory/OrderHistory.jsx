import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Table, Input, Select, Tag, Modal, Button, message } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { format } from "date-fns";

const { Option } = Select;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewCancelled, setViewCancelled] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Có lỗi xảy ra khi tải đơn hàng.");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (id) => {
    try {
      await axios.patch(`/orders/orderStatus/${id}`, {
        orderStatus: "cancelled",
      });
      message.success(`Đơn ${id} đã được hủy.`);
      fetchOrders();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        (viewCancelled
          ? order.orderStatus === "cancelled"
          : order.orderStatus !== "cancelled") &&
        (selectedStatus === "All" || order.orderStatus === selectedStatus) &&
        (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.products.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [orders, viewCancelled, selectedStatus, searchTerm]);

  const getStatusTag = (orderStatus) => {
    const statusMap = {
      delivered: { color: "green", text: "Đã giao" },
      pending: { color: "orange", text: "Chưa thanh toán" },
      processing: { color: "orange", text: "Đang xử lý" },
      shipped: { color: "orange", text: "Đang vận chuyển" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const { color, text } = statusMap[orderStatus] || { color: "default", text: orderStatus };
    return <Tag color={color}>{text}</Tag>;
  };


  const columns = [
    { title: "#", dataIndex: "idx", key: "idx" },
    { title: "Tên sản phẩm", dataIndex: "_id", key: "_id" },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `${amount} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (date ? format(new Date(date), "MM/dd/yyyy") : "N/A"),
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedOrder(record);
            setIsModalVisible(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Lịch sử đặt đơn hàng</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input
            placeholder="Tìm kiếm đơn..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "250px" }}
          />
          {!viewCancelled && (
            <Select
              defaultValue="All"
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: "160px" }}
            >
              <Option value="All">Tất cả</Option>
              <Option value="pending">Chưa thanh toán</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipped">Đang vận chuyển</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã huỷ</Option>
            </Select>
          )}
        </div>
        <Button type="white" onClick={() => setViewCancelled(!viewCancelled)}>
          {viewCancelled ? "Chi tiết đơn" : "Đơn đã huỷ "}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="orderId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
          selectedOrder && selectedOrder.orderStatus !== "cancelled" && (
            <Button
              key="cancel"
              type="danger"
              onClick={() => handleCancelOrder(selectedOrder._id)}
            >
              Hủy đơn
            </Button>
          ),
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Mã đơn:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {format(new Date(selectedOrder.date), "MM/dd/yyyy")}
            </p>
            <p>
              <strong>Trạng thái:</strong> {getStatusTag(selectedOrder.orderStatus)}
            </p>
            <h4>
              <strong>Sản phẩm:</strong>
            </h4>
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {selectedOrder.products.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "15px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                  <span style={{ fontSize: "16px" }}>
                    <p> Tên giày: {item.name}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p>Giá sản phẩm {item.price} VNĐ</p>
                    <p>Size: {item.size}</p>
                    <p>Màu: {item.color}</p>
                  </span>
                </div>
              ))}
            </div>
            <p>
              <strong>Tổng tiền:</strong> {selectedOrder.amount} VNĐ
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
