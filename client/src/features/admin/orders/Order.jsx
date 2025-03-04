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
} from "antd";
import { SearchOutlined, EyeOutlined, CloseOutlined } from "@ant-design/icons"; // Thêm EditOutlined
import { format } from "date-fns";

const { Option } = Select;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState(
    selectedOrder?.orderStatus || "pending"
  );

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
      setOrders(response.data.orders);
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
    const colors = {
      delivered: "green",
      pending: "orange",
      processing: "orange",
      shipped: "blue",
      cancelled: "red",
    };
    return <Tag color={colors[orderStatus] || "default"}>{orderStatus}</Tag>;
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/orders/orderStatus/${orderId}`, {
        orderStatus: "cancelled",
      });
      message.success(`Đơn ${orderId} đã được hủy.`);
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
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
      console.error("Error updating status:", error);
    }
  };
  const columns = [
    { title: "#", dataIndex: "idx", key: "idx" },
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (user) => user?.name || "Unknown",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `${amount} VNĐ`,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: ["paymentMethod", "paymentStatus"],
      key: "payment",
      render: (text, record) => 
        record.paymentMethod && record.paymentStatus
          ? `${record.paymentMethod} (${record.paymentStatus})`
          : "Không xác định"
      
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
        return date ? format(new Date(date), "MM/dd/yyyy") : "N/A";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.orderStatus !== "cancelled" && (
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
            Xem
          </Button>
        </div>
      ),
    },
  ];

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
          <Option value="All">All Statuses</Option>

          <Option value="pending">Pending</Option>
          <Option value="processing">Processing</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
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
        width={900}
      >
        {selectedOrder && (
          <div>
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
                <Option value="pending">Pending</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </p>

            {/* Thông tin khách hàng */}
            <h2>
              <strong>Thông tin khách hàng:</strong>
            </h2>
            {selectedOrder.userId && (
              <div style={{ marginBottom: "15px" }}>
                <p>
                  <strong>Tên:</strong> {selectedOrder.userId.name}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedOrder.userId.phone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.userId.email}
                </p>
                <p>
                  <strong>Giới thiệu:</strong>{" "}
                  {selectedOrder.userId.introduction || "Không có"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {selectedOrder.userId.address
                    ?.map((addr) => `${addr.address} (${addr.addressType})`)
                    .join(", ")}
                </p>
              </div>
            )}

            {/* Danh sách sản phẩm */}
            <h2>
              <strong>Sản phẩm trong đơn hàng:</strong>
            </h2>
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
                  <div>
                    <p>
                      <strong>Tên:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Màu sắc:</strong> {item.color}
                    </p>
                    <p>
                      <strong>Số lượng:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Kích thước:</strong> {item.size}
                    </p>
                    <p>
                      <strong>Thương hiệu:</strong> {item.productId.brand}
                    </p>
                    <p>
                      <strong>Mô tả:</strong> {item.productId.description}
                    </p>
                    <p>
                      <strong>Giá:</strong> {item.price} VNĐ
                    </p>
                    <p>
                      <strong>Loại sản phẩm:</strong> {item.productId.condition}
                    </p>
                    <p>
                      <strong>Đánh giá:</strong> {item.productId.rating} (
                      {item.ratingQuantity} lượt đánh giá)
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p>
              <strong>Phí vận chuyển:</strong> {selectedOrder.shippingFee} VNĐ
            </p>
            <p>
              <strong>Giảm giá Voucher:</strong> {selectedOrder.voucherDiscount}{" "}
              VNĐ
            </p>
            <p>
              <strong>Tổng tiền cuối cùng:</strong> {selectedOrder.finalTotal}{" "}
              VNĐ
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Order;
