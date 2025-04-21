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
  Timeline,
  Image,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CloseOutlined,
  EditOutlined,
  CheckCircleTwoTone,
  ClockCircleTwoTone,
} from "@ant-design/icons";
import { format } from "date-fns";
import moment from "moment";
import { getBaseUrl } from "../../../utils/baseURL";

const { Option } = Select;

const Order = () => {
  const { RangePicker } = DatePicker;
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [tempStatus, setTempStatus] = useState({});
  const [combinedSearch, setCombinedSearch] = useState("");

  const handleSearchPhoneUser = async () => {
    if (!combinedSearch) {
      message.warning("Vui lòng nhập thông tin tìm kiếm");
      return;
    }
    try {
      if (combinedSearch.match(/^\d+$/)) {
        const [userResponse, recipientResponse] = await Promise.all([
          axios
            .get(`/orders/userPhone-check/${combinedSearch}`)
            .catch(() => ({ data: { data: [] } })),
          axios
            .get(`/orders/recipientPhone-check/${combinedSearch}`)
            .catch(() => ({ data: { data: [] } })),
        ]);
        const combinedOrders = [
          ...userResponse.data.data,
          ...recipientResponse.data.data,
        ];
        setOrders(
          [
            ...new Set(combinedOrders.map((order) => JSON.stringify(order))),
          ].map((str) => JSON.parse(str))
        );
      } else {
        const response = await axios.get(`/orders`);
        setOrders(
          response.data.orders.filter(
            (order) =>
              order.orderId
                .toLowerCase()
                .includes(combinedSearch.toLowerCase()) ||
              order.products.some((item) =>
                item.name.toLowerCase().includes(combinedSearch.toLowerCase())
              )
          )
        );
      }
    } catch (error) {
      if (error.response?.data?.message === "SO_DIEN_THOAI_CHUA_DUOC_DANG_KI") {
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
        `${getBaseUrl()}/api/v1/thongke/order-statistics?startDate=${startDate}&endDate=${endDate}`
      );
      setCombinedSearch("");
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
          order.orderId.toLowerCase().includes(combinedSearch.toLowerCase()) ||
          (order.userId?.name &&
            order.userId.name
              .toLowerCase()
              .includes(combinedSearch.toLowerCase())) ||
          order.products.some((item) =>
            item.name.toLowerCase().includes(combinedSearch.toLowerCase())
          ) ||
          String(order.userId?.phoneNumber || "").includes(combinedSearch) ||
          String(order.shippingAddress?.recipientPhone || "").includes(
            combinedSearch
          );
        const matchesStatus =
          selectedStatus === "All" || order.orderStatus === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .map((order, index) => ({ ...order, idx: index + 1 }));
  }, [orders, combinedSearch, selectedStatus]);

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
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: newStatus,
                  statusHistory: [
                    ...(order.statusHistory || []),
                    { status: newStatus, date: new Date() },
                  ],
                }
              : order
          )
        );
      } else {
        setTempStatus((prev) => {
          const newTempStatus = { ...prev };
          delete newTempStatus[orderId];
          return newTempStatus;
        });
        message.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.");
      }
    } catch (error) {
      setTempStatus((prev) => {
        const newTempStatus = { ...prev };
        delete newTempStatus[orderId];
        return newTempStatus;
      });
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
            value={tempStatus[record._id] || status}
            onChange={(value) => {
              setTempStatus((prev) => ({
                ...prev,
                [record._id]: value,
              }));
            }}
            style={{ width: 150 }}
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
            onClick={() =>
              handleUpdateStatus(record._id, tempStatus[record._id] || status)
            }
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
    setCombinedSearch("");
    fetchStatistics();
  };

  const productColumns = [
    {
      title: "Chi tiết sản phẩm",
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
      render: (price) => `${price.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        date ? format(new Date(date), "HH:mm dd/MM/yyyy") : "N/A",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const cancellationColumns = [
    {
      title: "Ảnh minh họa",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Hình ảnh minh họa lý do ${index + 1}`}
                style={{ maxWidth: "100px", borderRadius: "4px" }}
              />
            ))
          ) : (
            <span>Không có ảnh</span>
          )}
        </div>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Xác nhận",
      dataIndex: "isConfirmed",
      key: "isConfirmed",
      render: (isConfirmed) => (isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"),
    },
    {
      title: "Thời gian xác nhận",
      dataIndex: "confirmationDate",
      key: "confirmationDate",
      render: (confirmationDate) =>
        confirmationDate
          ? format(new Date(confirmationDate), "HH:mm dd/MM/yyyy")
          : "N/A",
    },
    {
      title: "Người dùng xác nhận",
      dataIndex: "userConfirmed",
      key: "userConfirmed",
      render: (userConfirmed) => (userConfirmed ? "Có" : "Không"),
    },
  ];

  const returnRequestColumns = [
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      render: (date) =>
        date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "N/A",
    },
    {
      title: "Ảnh minh họa",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Hình ảnh minh họa lý do ${index + 1}`}
                style={{ maxWidth: "200px", borderRadius: "4px" }}
              />
            ))
          ) : (
            <span>Không có ảnh</span>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          pending: { color: "orange", text: "Đang chờ" },
          approved: { color: "green", text: "Đã phê duyệt" },
          rejected: { color: "red", text: "Bị từ chối" },
        };
        const { color, text } = statusMap[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thời gian phê duyệt",
      dataIndex: "approvalDate",
      key: "approvalDate",
      render: (approvalDate) =>
        approvalDate
          ? format(new Date(approvalDate), "dd/MM/yyyy HH:mm")
          : "N/A",
    },
    {
      title: "Người dùng xác nhận",
      dataIndex: "userConfirmed",
      key: "userConfirmed",
      render: (userConfirmed) => (userConfirmed ? "Có" : "Không"),
    },
  ];

  const getOrderTimeline = (order) => {
    const timeline = [
      {
        label: "Ngày đặt hàng",
        time: format(new Date(order?.date), "HH:mm dd/MM/yyyy"),
        completed: true,
      },
    ];

    const statusOrder = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "trahang",
    ];
    const statusLabels = {
      pending: "Chưa thanh toán",
      processing: "Đang xử lý",
      shipped: "Đang vận chuyển",
      delivered: "Đã giao thành công",
      cancelled: "Đã hủy",
      trahang: "Đã hoàn",
    };

    const seenStatuses = new Set();
    const sortedHistory = (order?.statusHistory || [])
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((entry) => statusOrder.includes(entry.status));

    for (const status of statusOrder) {
      const historyEntry = sortedHistory.find(
        (entry) => entry.status === status && !seenStatuses.has(status)
      );
      if (historyEntry && statusLabels[status]) {
        seenStatuses.add(status);
        timeline.push({
          label: statusLabels[status],
          time: format(new Date(historyEntry.date), "HH:mm dd/MM/yyyy"),
          completed: true,
        });
      }
    }

    return timeline;
  };

  const hasRecipientInfo =
    selectedOrder?.shippingAddress?.recipientName ||
    selectedOrder?.shippingAddress?.recipientPhone ||
    selectedOrder?.shippingAddress?.recipientAddress;

  return (
    <div style={{ padding: "20px" }}>
      {!selectedOrder && (
        <>
          <h2>Quản lý đơn hàng</h2>
          <div style={{ marginBottom: "16px", display: "flex", gap: "10px" }}>
            <Input
              placeholder="Tìm kiếm đơn hàng, số điện thoại người đặt hoặc nhận"
              prefix={<SearchOutlined />}
              allowClear
              value={combinedSearch}
              onChange={(e) => setCombinedSearch(e.target.value)}
              style={{ width: "350px" }}
            />
            <Select
              defaultValue="All"
              onChange={(value) => setSelectedStatus(value)}
              style={{ width: "170px" }}
            >
              <Option value="All">Tất cả</Option>
              <Option value="pending">Chưa thanh toán</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipped">Đang vận chuyển</Option>
              <Option value="delivered">Đã giao</Option>
              <Option value="cancelled">Đã hủy</Option>
              <Option value="trahang">Đã Trả Hàng</Option>
            </Select>
            <RangePicker
              style={{ marginLeft: "auto" }}
              value={dateRange}
              onChange={handleDateChange}
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              ranges={{
                "Hôm nay": [moment().startOf("day"), moment()],
                "7 ngày qua": [moment().subtract(7, "days"), moment()],
                "30 ngày qua": [moment().subtract(30, "days"), moment()],
                "Tháng này": [moment().startOf("month"), moment()],
              }}
            />
            <Button
              type="primary"
              onClick={handleFilter}
              style={{ marginLeft: 8 }}
            >
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

      {selectedOrder && (
        <div style={{ padding: "20px" }}>
          <Button
            style={{ marginBottom: "20px" }}
            onClick={() => setSelectedOrder(null)}
          >
            Quay lại danh sách
          </Button>
          <Row gutter={[16, 16]}>
            <Col span={18}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <strong>
                      <h3 style={{ marginBottom: "16px" }}>
                        Chi tiết đơn hàng ({selectedOrder.orderId})
                      </h3>
                    </strong>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Ngày đặt:</strong>{" "}
                      {format(new Date(selectedOrder.date), "dd/MM/yyyy")}
                    </p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Dạng thanh toán:</strong>{" "}
                      {selectedOrder.paymentMethod || "Online"}
                    </p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Kiểu Ship:</strong> Fast Shipping
                    </p>
                  </div>
                </Col>

                {hasRecipientInfo && (
                  <Col span={8}>
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <strong>
                        <h3 style={{ marginBottom: "16px" }}>Người đặt: </h3>
                      </strong>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "8px 0",
                        }}
                      >
                        <span>
                          <strong>Tên:</strong>{" "}
                          {selectedOrder.userId?.name || "N/A"}
                        </span>
                      </div>
                      <p>
                        <span>
                          <strong>Email:</strong>{" "}
                          {selectedOrder.userId?.email || "N/A"}
                        </span>
                      </p>
                      <p style={{ margin: "8px 0" }}>
                        <strong>Số điện thoại:</strong>{" "}
                        {selectedOrder.userId?.phoneNumber || "N/A"}
                      </p>
                      <p style={{ margin: "8px 0" }}>
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.shippingAddress?.address || "N/A"}
                      </p>
                    </div>
                  </Col>
                )}

                <Col span={hasRecipientInfo ? 8 : 16}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "16px",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <strong>
                      <h3 style={{ marginBottom: "16px" }}>Người nhận: </h3>
                    </strong>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Tên:</strong>{" "}
                      {hasRecipientInfo
                        ? selectedOrder.shippingAddress.recipientName
                        : selectedOrder.userId?.name || "N/A"}
                    </p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Số điện thoại:</strong>{" "}
                      {hasRecipientInfo
                        ? selectedOrder.shippingAddress.recipientPhone
                        : selectedOrder.userId?.phoneNumber || "N/A"}
                    </p>
                    <p style={{ margin: "8px 0" }}>
                      <strong>Địa chỉ:</strong>{" "}
                      {hasRecipientInfo
                        ? selectedOrder.shippingAddress.recipientAddress
                        : selectedOrder.shippingAddress?.address || "N/A"}
                    </p>
                  </div>
                </Col>
              </Row>

              <div style={{ marginTop: "20px" }}>
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

              {(selectedOrder.orderStatus === "cancelled" ||
                selectedOrder.orderStatus === "trahang") && (
                <div style={{ marginTop: "20px" }}>
                  <strong>
                    <h3 style={{ marginBottom: "16px" }}>
                      {selectedOrder.orderStatus === "cancelled"
                        ? "Lý do hủy đơn"
                        : "Lý do hoàn hàng"}
                    </h3>
                  </strong>
                  <Table
                    columns={
                      selectedOrder.orderStatus === "cancelled"
                        ? cancellationColumns
                        : returnRequestColumns
                    }
                    dataSource={[
                      selectedOrder.orderStatus === "cancelled"
                        ? selectedOrder.cancellation
                        : selectedOrder.returnRequest,
                    ]}
                    rowKey="date"
                    pagination={false}
                    bordered
                  />
                </div>
              )}
            </Col>

            <Col span={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  height: "100%",
                }}
              >
                <h3 style={{ marginBottom: "16px" }}>Trạng thái đơn hàng</h3>
                <Timeline>
                  {getOrderTimeline(selectedOrder).map(
                    (step, index) => (
                      <Timeline.Item
                        key={index}
                        dot={
                          step.completed ? (
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                          ) : (
                            <ClockCircleTwoTone twoToneColor="#d9d9d9" />
                          )
                        }
                        color={step.completed ? "green" : "gray"}
                      >
                        <p style={{ fontWeight: "bold" }}>{step.label}</p>
                        <p>{step.time}</p>
                      </Timeline.Item>
                    )
                  )}
                </Timeline>
                <div style={{ marginTop: "20px" }}>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Tổng tiền sản phẩm:</strong>{" "}
                    {selectedOrder.total?.toLocaleString("vi-VN") || "0"} VNĐ
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {selectedOrder.shippingFee?.toLocaleString("vi-VN") || "0"}{" "}
                    VNĐ
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Giảm giá Voucher:</strong>{" "}
                    {selectedOrder.voucherDiscount?.toLocaleString("vi-VN") ||
                      "0"}{" "}
                    VNĐ
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    <strong>Tổng tiền cuối cùng:</strong>{" "}
                    {selectedOrder.amount?.toLocaleString("vi-VN") || "0"} VNĐ
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Order;
