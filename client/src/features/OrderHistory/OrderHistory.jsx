import React, { useState, useMemo } from "react";
import { Table, Input, Select, Tag, Modal, Button } from "antd";
import { SearchOutlined, EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { format } from "date-fns";

const { Option } = Select;

const OrderHistory = () => {
  const generateMockOrders = () => {
    const statuses = ["Delivered", "Processing", "Shipped"];
    const products = [
      { name: "Premium Headphones", price: 149.99 },
      { name: "Wireless Mouse", price: 49.99 },
      { name: "Gaming Keyboard", price: 159.99 },
      { name: "4K Monitor", price: 499.99 },
      { name: "HDMI Cable", price: 19.99 },
      { name: "Gaming Mouse", price: 79.99 },
      { name: "USB-C Hub", price: 39.99 },
      { name: "Webcam HD", price: 89.99 }
    ];

    return Array.from({ length: 100 }, (_, index) => {
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = Array.from({ length: numItems }, () => {
        const product = products[Math.floor(Math.random() * products.length)];
        return {
          name: product.name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: product.price
        };
      });

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      return {
        id: `ORD-${(index + 1).toString().padStart(3, "0")}`,
        date: date,
        items: items,
        total: total,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
    });
  };

  const [orders] = useState(generateMockOrders());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const getStatusTag = status => {
    const colors = {
      Delivered: "green",
      Processing: "orange",
      Shipped: "blue"
    };
    return <Tag color={colors[status] || "default"}>{status}</Tag>;
  };

  const columns = [
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: date => format(date, "MM/dd/yyyy")
    },
    {
      title: "Order Number",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: items => (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name}
              {item.name} (x{item.quantity})
            </li>
          ))}
        </ul>
      )
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      render: total => `$${total.toFixed(2)}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Delivered", value: "Delivered" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" }
      ],
      onFilter: (value, record) => record.status === value,
      render: status => getStatusTag(status)
    },
    {
      title: "Actions",
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
          View
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order History</h2>
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
          <Option value="Delivered">Delivered</Option>
          <Option value="Processing">Processing</Option>
          <Option value="Shipped">Shipped</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
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
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            Download Invoice
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <p>
              <strong>Order Number:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Date:</strong> {format(selectedOrder.date, "MM/dd/yyyy")}
            </p>
            <p>
              <strong>Status:</strong> {getStatusTag(selectedOrder.status)}
            </p>
            <h4>Items:</h4>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.total.toFixed(2)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
