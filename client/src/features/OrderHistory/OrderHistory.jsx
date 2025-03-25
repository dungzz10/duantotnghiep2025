import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Table, Input, Select, Tag, Modal, Button, message, Steps } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import dayjs from "dayjs";
import { api } from "../../axios/api";

const { Option } = Select;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewCancelled, setViewCancelled] = useState(false);
  const { Step } = Steps;
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
  console.log(orders, 9999);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (id) => {
    try {
      // await axios.patch(`/orders/orderStatus/${id}`, {
      //   orderStatus: "cancelled",
      // });
      // message.success(`Đơn ${id} đã được hủy.`);
      await api.delete(`/orders/${id}`);
      message.success(`Đơn ${id} đã được hủy.`);
      fetchOrders();
      setIsModalVisible(false);

      fetchOrders();
      console.log(id, 9999);
    } catch (error) {
      console.error("Error canceling order:", error);
      // message.error("Có lỗi xảy ra khi hủy đơn hàng.");
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
      processing: { color: "green", text: "Đã thanh toán" },
      shipped: { color: "blue", text: "Đang vận chuyển" },
      cancelled: { color: "red", text: "Đã hủy" },
    };
    const { color, text } = statusMap[orderStatus] || {
      color: "default",
      text: orderStatus,
    };
    return <Tag color={color}>{text}</Tag>;
  };
  const getCurrentStep = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 4;
      default:
        return 0;
    }
  };

  const columns = [
    { title: "#", dataIndex: "idx", key: "idx" },
    {
      title: "Tên sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        products.length > 0 ? products[0].name : "Không có sản phẩm",
    },
    {
      title: "Số lượng",
      dataIndex: "products",
      key: "quantity",
      render: (products) =>
        products.reduce((sum, item) => sum + item.quantity, 0),
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString("vi-VN")} VNĐ`,
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
      render: (date) => (date ? format(new Date(date), "dd/MM/yyyy") : "N/A"),
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
            </Select>
          )}
        </div>
        <Button type="dashed" onClick={() => setViewCancelled(!viewCancelled)}>
          {viewCancelled ? "Đơn của bạn" : "Đơn đã huỷ "}
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
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ padding: "10px" }}>
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Trạng thái:</strong>{" "}
                  {getStatusTag(selectedOrder.orderStatus)}
                </p>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <p style={{ margin: 0 }}>
                    <strong>Mã đơn:</strong> {selectedOrder.orderId}
                  </p>
                  {selectedOrder.orderStatus === "processing" && (
                    <Tag
                      color="volcano"
                      style={{ fontWeight: 500, padding: "4px 10px" }}
                    >
                      Đang chuẩn bị hàng
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            <Steps
              current={getCurrentStep(selectedOrder.orderStatus)}
              style={{ marginBottom: "20px" }}
            >
              <Step
                title="Đơn Hàng Đã Đặt"
                description={format(
                  new Date(selectedOrder.date),
                  "HH:mm dd-MM-yyyy"
                )}
              />
              <Step
                title="Đơn Hàng Đã Thanh Toán"
                description={
                  selectedOrder.orderStatus !== "pending"
                    ? selectedOrder.paymentTime
                      ? `Đã thanh toán lúc ${format(
                          new Date(selectedOrder.paymentTime),
                          "HH:mm dd-MM-yyyy"
                        )}`
                      : "Đã thanh toán"
                    : "Chưa thanh toán"
                }
              />
              <Step
                title="Vận Chuyển"
                description={
                  ["shipped", "delivered", "completed"].includes(
                    selectedOrder.orderStatus
                  )
                    ? selectedOrder.shippingTime
                      ? format(
                          new Date(selectedOrder.shippingTime),
                          "HH:mm dd-MM-yyyy"
                        )
                      : "Đã vận chuyển"
                    : "Chưa vận chuyển"
                }
              />

              <Step
                title="Chờ Giao Hàng"
                description={
                  ["delivered", "completed"].includes(selectedOrder.orderStatus)
                    ? selectedOrder.deliveryTime
                      ? format(
                          new Date(selectedOrder.deliveryTime),
                          "HH:mm dd-MM-yyyy"
                        )
                      : "Đã giao hàng"
                    : "Chưa giao hàng"
                }
              />
              <Step
                title={
                  selectedOrder.orderStatus === "cancelled"
                    ? "Đã huỷ"
                    : "Đánh Giá"
                }
                description={
                  selectedOrder.orderStatus === "cancelled"
                    ? "Đơn hàng đã bị hủy"
                    : "Chưa đánh giá"
                }
                icon={<EyeOutlined />}
              />
            </Steps>
            {selectedOrder?.date && (
              <div
                style={{
                  backgroundColor: "#fff8e1",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ marginBottom: "8px" }}>
                  Đơn hàng sẽ được chuẩn bị và chuyển đi trước{" "}
                  <strong style={{ color: "#007bff" }}>
                    {dayjs(selectedOrder.date)
                      .add(2, "day")
                      .format("DD-MM-YYYY")}
                  </strong>
                  .
                </p>
                <p style={{ marginBottom: "12px" }}>
                  🚚 Giao nhanh đúng hẹn: nhận Voucher 15.000đ nếu đơn hàng được
                  giao đến bạn sau ngày{" "}
                  <strong>
                    {dayjs(selectedOrder.date)
                      .add(5, "day")
                      .format("DD-MM-YYYY")}
                  </strong>
                  . <a href="#">Xem thêm</a>
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "auto",
                    gap: "10px",
                  }}
                >
                  <Button type="default">Liên Hệ Người Bán</Button>
                  <Button
                    danger
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    disabled={
                      selectedOrder.orderStatus === "cancelled" ||
                      selectedOrder.orderStatus === "delivered"
                    }
                  >
                    Hủy Đơn Hàng
                  </Button>
                </div>
              </div>
            )}
            <div className="flex">
              <div>
                <strong>Sản phẩm: </strong>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginTop: "10px",
                  }}
                >
                  {selectedOrder.products.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "250px",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "8px",
                        }}
                      />
                      <div style={{ width: "100%" }}>
                        <p>
                          <strong>Tên:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Giá:</strong>{" "}
                          {item.price.toLocaleString("vi-VN")} VNĐ
                        </p>
                        <p>
                          <strong>Size:</strong> {item.size}
                        </p>
                        <p>
                          <strong>Màu:</strong> {item.color}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: "10px",
                    marginTop: "15px",
                  }}
                >
                  <strong>Tổng tiền:</strong>{" "}
                  {selectedOrder.amount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
              <div style={{ width: "50%" }}>
                <strong>Thông tin người đặt:</strong>
                <div style={{ marginBottom: "10px" }}>
                  <p>
                    <strong>Người đặt:</strong> {selectedOrder.userId.name}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedOrder.shippingAddress.address}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {selectedOrder.userId.phoneNumber}
                  </p>
                </div>
              </div>

              {selectedOrder.shippingAddress.recipientName && (
                <div style={{ width: "50%" }}>
                  <strong>Thông tin người nhận:</strong>
                  <div style={{ marginBottom: "10px" }}>
                    <p>
                      <strong>Người nhận:</strong>{" "}
                      {selectedOrder.shippingAddress.recipientName}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong>{" "}
                      {selectedOrder.shippingAddress.recipientAddress}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong>{" "}
                      {selectedOrder.shippingAddress.recipientPhone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
