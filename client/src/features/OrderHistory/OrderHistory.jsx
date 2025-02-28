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
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

const { Option } = Select;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/orders/");
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
    return orders.filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        selectedStatus === "All" || order.orderStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusTag = (orderStatus) => {
    const colors = {
      delivered: "green",
      pending: "orange",
      processing: "orange",
      shipped: "orange",
      cancelled: "red",
    };
    return <Tag color={colors[orderStatus] || "default"}>{orderStatus}</Tag>;
  };

  const handleStatusChange = async (orderStatus, orderId) => {
    try {
      await axios.patch(`/orders/${orderId}/orderStatus`, { orderStatus });
      message.success(`Order ${orderId} orderStatus updated to ${orderStatus}`);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating orderStatus:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`/orders/${orderId}`);
      message.success(`Đơn ${orderId} đã được xoá.`);
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  const columns = [
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => {
        console.log("Giá trị date:", date);
        return date ? format(new Date(date), "MM/dd/yyyy") : "N/A";
      },
    },
    {
      title: "Order Number",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Product",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        Array.isArray(products) && products.length > 0 ? (
          <ul>
            {products.map((item, idx) => (
              <li key={idx}>
                {item.productId?.name || item.name || "Unknown"} (x
                {item.quantity}) - $
                {(item.productId?.price || item.price || 0).toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <span>No products</span>
        ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `$${amount}`,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      filters: [
        { text: "Completed", value: "completed" },
        { text: "Pending", value: "pending" },
        { text: "Failed", value: "failed" },
      ],
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.status !== "completed" && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleStatusChange("completed", record.orderId)}
            >
              Mark as Completed
            </Button>
          )}
          {record.status !== "failed" && (
            <Popconfirm
              title="Are you sure you want to cancel this order?"
              onConfirm={() => handleCancelOrder(record.orderId)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<CloseOutlined />}>
                Cancel Order
              </Button>
            </Popconfirm>
          )}
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Management</h2>
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
          <Option value="completed">Completed</Option>
          <Option value="pending">Pending</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="orderId"
        pagination={{ pageSize: 10 }}
        loading={orders.length === 0}
      />

      {/* Modal để hiển thị chi tiết đơn hàng */}
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
           <Button key="edit" type="primary" icon={<EditOutlined />}>
           Edit
         </Button>,
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Order Number:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Date:</strong> {format(selectedOrder.date, "MM/dd/yyyy")}
            </p>
            <p>
            <strong>Status:</strong> {getStatusTag(selectedOrder.orderStatus)}
            </p>
            <h4>Items:</h4>
            <ul>
              {selectedOrder.products.map((item, idx) => (
                <li key={idx}>
                  {item.name} (x{item.quantity}) - ${item.price}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.amount}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
