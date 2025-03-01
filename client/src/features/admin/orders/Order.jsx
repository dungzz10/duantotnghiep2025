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
  CloseOutlined,
} from "@ant-design/icons"; // Thêm EditOutlined
import { format } from "date-fns";

const { Option } = Select;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStatus, setEditingStatus] = useState(selectedOrder?.orderStatus || "pending");
  
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
      await axios.delete(`/orders/${orderId}`);
      message.success(`Đơn ${orderId} đã được xoá.`);
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };
  const handleUpdateStatus = async () => {
    try {
        await axios.patch(`/orders/orderStatus/${selectedOrder._id}`, { orderStatus: editingStatus });
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
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "userId",
      key: "userId",
      render: (user) => user?.name || "Unknown",
    },    
    {
      title: "Số lượng",
      dataIndex: "products",
      key: "products",
      render: (products) => 
        products.reduce((total, item) => total + item.quantity, 0),
    },
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
      onFilter: (value, record) => record.orderStatus === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => {
        console.log("Giá trị date:", date);
        return date ? format(new Date(date), "MM/dd/yyyy") : "N/A";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div>
          {record.status !== "failed" && (
            <Popconfirm
              title="Xoá đơn ?"
              onConfirm={() => handleCancelOrder(record.orderId)}
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
        pagination={{ pageSize: 10 }}
      />

      {/* Modal để hiển thị chi tiết đơn hàng */}
      <Modal
            title="Chi tiết đơn hàng"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="save" type="primary" onClick={handleUpdateStatus}>Lưu</Button>,
                <Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>
            ]}
            width={900}
        >
            {selectedOrder && (
                <div>
                    <p><strong>ID:</strong> {selectedOrder._id}</p>
                    <p><strong>Date:</strong> {format(new Date(selectedOrder.date), "MM/dd/yyyy")}</p>
                    <p><strong>Status:</strong> 
                        <Select defaultValue={editingStatus} onChange={setEditingStatus} style={{ width: 200, marginLeft: 10 }}>
                            <Option value="pending">Pending</Option>
                            <Option value="processing">Processing</Option>
                            <Option value="shipped">Shipped</Option>
                            <Option value="delivered">Delivered</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </p>
                    <h4><strong>Products:</strong></h4>
                    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                        {selectedOrder.products.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "20px", marginBottom: "15px", alignItems: "center" }}>
                                <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }} />
                                <span style={{ fontSize: "16px" }}>{item.name} (x{item.quantity}) - {item.price} VNĐ - {item.size} - {item.color}</span>
                            </div>
                        ))}
                    </div>
                    <p><strong>Tổng tiền:</strong> {selectedOrder.amount} VNĐ</p>
                </div>
            )}
        </Modal>
    </div>
  );
};

export default Order;
