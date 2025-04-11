import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Select,
  Tag,
  Modal,
  Button,
  message,
  Steps,
  Form,
  Upload,
  Image,
} from "antd";
import { SearchOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
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
  const [cancelImages, setCancelImages] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnImages, setReturnImages] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelImageUpload = async ({ file }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsenpijts/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const imageUrl = data.secure_url;
      setCancelImages((prev) => [...prev, imageUrl]);
    } catch (error) {
      message.error("Upload ảnh thất bại");
    }
  };

  const handleReturnImageUpload = async ({ file }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "upploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsenpijts/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const imageUrl = data.secure_url;
      setReturnImages((prev) => [...prev, imageUrl]);
    } catch (error) {
      message.error("Upload ảnh thất bại");
    }
  };

  const handleCancelOrder = async (id) => {
    if (!cancelReason.trim()) {
      message.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    if (cancelImages.length === 0) {
      message.error("Vui lòng tải lên ít nhất 1 ảnh xác nhận");
      return;
    }

    try {
      const res = await api.delete(`/orders/${id}`, {
        data: {
          reason: cancelReason,
          images: cancelImages,
        },
      });

      message.warning(`Đơn ${id} ${res.data.message}`);
      fetchOrders();
      setShowCancelModal(false);
      setCancelImages([]);
      setCancelReason("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleReturnOrder = async (orderId, orderDate) => {
    const currentDate = dayjs();
    const orderPlacedDate = dayjs(orderDate);
    const diffDays = currentDate.diff(orderPlacedDate, "day");

    if (diffDays > 20) {
      message.error(
        "Đã quá 20 ngày kể từ ngày đặt, bạn không thể trả hàng được nữa."
      );
      return;
    }

    if (!returnReason.trim()) {
      message.error("Vui lòng nhập lý do trả hàng");
      return;
    }

    if (returnImages.length === 0) {
      message.error("Vui lòng tải lên ít nhất 1 ảnh xác nhận");
      return;
    }

    try {
      const response = await axios.patch(`/orders/return/${orderId}`, {
        reason: returnReason,
        images: returnImages,
      });

      message.success(`Đơn hàng đã được trả lại.`);
      fetchOrders();
      setShowReturnModal(false);
      setReturnImages([]);
      setReturnReason("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error returning order:", error);
      message.error("Có lỗi xảy ra khi trả hàng.");
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
      returned: { color: "purple", text: "Đã trả hàng" },
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
      case "returned":
        return 4;
      case "cancelled":
        return 5;
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

  const productColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <Image
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
            <div style={{ fontWeight: "500" }}>
              {record.name || "Không có tên"}
            </div>
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
          <Tag
            color={color}
            style={{ borderRadius: "12px", padding: "2px 8px" }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
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
              <Option value="trahang">Đã trả hàng</Option>
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
            <div style={{ display: "flex", flexDirection: "row", gap: "24px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <strong>Thông tin người đặt:</strong>
                <p>
                  <strong>Tên:</strong> {selectedOrder.userId.name}
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

              {selectedOrder.shippingAddress.recipientName && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginLeft: "300px",
                  }}
                >
                  <strong>Thông tin người nhận:</strong>
                  <p>
                    <strong>Tên:</strong>{" "}
                    {selectedOrder.shippingAddress.recipientName}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedOrder.shippingAddress.recipientAddress}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong>{" "}
                    {selectedOrder.shippingAddress.recipientPhone}
                  </p>
                </div>
              )}
            </div>
            <br />
            <hr />
            <br />
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
                  selectedOrder.orderStatus === "trahang"
                    ? "Đã trả hàng"
                    : selectedOrder.orderStatus === "cancelled"
                    ? "Đã huỷ"
                    : "Đánh Giá"
                }
                description={
                  selectedOrder.orderStatus === "cancelled"
                    ? "Đơn hàng đã bị hủy"
                    : selectedOrder.orderStatus === "trahang"
                    ? selectedOrder.returnTime
                      ? format(
                          new Date(selectedOrder.returnTime),
                          "HH:mm dd-MM-yyyy"
                        )
                      : "Đã trả hàng"
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
                    onClick={() => setShowCancelModal(true)}
                    disabled={
                      selectedOrder.orderStatus === "cancelled" ||
                      selectedOrder.orderStatus === "delivered" ||
                      selectedOrder.orderStatus === "trahang"
                    }
                  >
                    Hủy Đơn Hàng
                  </Button>
                  <Button
                    danger
                    onClick={() => setShowReturnModal(true)}
                    disabled={selectedOrder.orderStatus !== "delivered"}
                  >
                    Trả hàng
                  </Button>
                </div>
              </div>
            )}
            <div>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "20px",
                  marginTop: "16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <strong>Tổng tiền hàng:</strong>{" "}
                  {selectedOrder.total.toLocaleString("vi-VN")} VNĐ
                </div>
                <div>
                  <strong>Phí vận chuyển:</strong>{" "}
                  {selectedOrder.shippingFee.toLocaleString("vi-VN")} VNĐ
                </div>
                <div>
                  <strong>Voucher:</strong>{" "}
                  -{selectedOrder.voucherDiscount.toLocaleString("vi-VN")} VNĐ
                </div>
                <div>
                  <strong>Thanh toán:</strong>{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {selectedOrder.amount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowCancelModal(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={() => handleCancelOrder(selectedOrder._id)}
          >
            Xác nhận hủy
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Lý do hủy đơn"
            required
            rules={[{ required: true, message: "Vui lòng nhập lý do hủy đơn" }]}
          >
            <Input.TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh xác nhận"
            required
            rules={[
              { required: true, message: "Vui lòng tải lên ít nhất 1 ảnh" },
            ]}
          >
            <Upload
              customRequest={handleCancelImageUpload}
              listType="picture-card"
              fileList={cancelImages.map((url, index) => ({
                uid: index,
                name: `image-${index}`,
                status: "done",
                url,
              }))}
              onRemove={(file) => {
                const newImages = cancelImages.filter(
                  (url) => url !== file.url
                );
                setCancelImages(newImages);
              }}
            >
              {cancelImages.length < 3 && <PlusOutlined />}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận trả hàng"
        visible={showReturnModal}
        onCancel={() => setShowReturnModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowReturnModal(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={() =>
              handleReturnOrder(selectedOrder._id, selectedOrder.date)
            }
          >
            Xác nhận trả hàng
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item
            label="Lý do trả hàng"
            required
            rules={[
              { required: true, message: "Vui lòng nhập lý do trả hàng" },
            ]}
          >
            <Input.TextArea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="Nhập lý do trả hàng..."
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh xác nhận"
            required
            rules={[
              { required: true, message: "Vui lòng tải lên ít nhất 1 ảnh" },
            ]}
          >
            <Upload
              customRequest={handleReturnImageUpload}
              listType="picture-card"
              fileList={returnImages.map((url, index) => ({
                uid: index,
                name: `image-${index}`,
                status: "done",
                url,
              }))}
              onRemove={(file) => {
                const newImages = returnImages.filter(
                  (url) => url !== file.url
                );
                setReturnImages(newImages);
              }}
            >
              {returnImages.length < 3 && <PlusOutlined />}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderHistory;