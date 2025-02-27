import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Table, Input, Select, Tag, Modal, Button, Popconfirm, message } from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";  // Thêm EditOutlined
import { format } from "date-fns";

const { Option } = Select;

const Order = () => {
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
    return orders.filter(order => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusTag = status => {
    const colors = {
      completed: "green",
      pending: "orange",
      failed: "red",
    };
    return <Tag color={colors[status] || "default"}>{status}</Tag>;
  };

  const handleStatusChange = async (status, orderId) => {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status });
      message.success(`Order ${orderId} status updated to ${status}`);
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`/orders/${orderId}`);
      message.success(`Order ${orderId} has been canceled.`);
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
      render: date => format(date, "MM/dd/yyyy"),
    },
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Items",
      dataIndex: "products",
      key: "products",
      render: products => (
        <ul>
          {products.map((item, idx) => (
            <li key={idx}>
              {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: amount => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Completed", value: "completed" },
        { text: "Pending", value: "pending" },
        { text: "Failed", value: "failed" },
      ],
      onFilter: (value, record) => record.status === value,
      render: status => getStatusTag(status),
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
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
        />
        <Select
          defaultValue="All"
          onChange={value => setSelectedStatus(value)}
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
            <p><strong>Order Number:</strong> {selectedOrder.orderId}</p>
            <p><strong>Date:</strong> {format(selectedOrder.date, "MM/dd/yyyy")}</p>
            <p><strong>Status:</strong> {getStatusTag(selectedOrder.status)}</p>
            <h4><strong>Items: </strong> </h4>
            <ul>
              {selectedOrder.products.map((item, idx) => (
                <li key={idx}>
                  {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p><strong>Total Amount:</strong> ${selectedOrder.amount.toFixed(2)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Order;
