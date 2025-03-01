import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Table, Tag, Tabs, Image } from "antd";
import { useUserDetail } from "./useUserDetail";

const { TabPane } = Tabs;

const UserDetail = () => {
  const { userId } = useParams();
  const { data, isLoading } = useUserDetail(userId);

  if (isLoading) return <div>Loading...</div>;

  const { name, email, photo, role, introduction, createdAt, wallet, address, orders } =
    data?.data || {};

  // Transaction columns configuration
  const transactionColumns = [
    {
      title: "Mã giao dịch",
      dataIndex: "momoTransactionId",
      key: "momoTransactionId",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Thành công"
              ? "success"
              : status === "Đang xử lý"
              ? "processing"
              : "error"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
  ];

  // Order columns configuration
  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "delivered"
              ? "success"
              : status === "pending"
              ? "processing"
              : status === "cancelled"
              ? "error"
              : "warning"
          }
        >
          {status === "delivered" ? "Đã giao hàng" :
           status === "pending" ? "Chờ xử lý" :
           status === "cancelled" ? "Đã hủy" :
           status === "processing" ? "Đang xử lý" :
           status === "shipped" ? "Đang giao hàng" : status}
        </Tag>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "completed" ? "success" : "processing"}>
          {status === "completed" ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "finalTotal",
      key: "finalTotal",
      render: (amount) => `${amount?.toLocaleString()}đ`,
    },
  ];

  // Expandable row render for order details
  const expandedRowRender = (order) => {
    const columns = [
      {
        title: "Sản phẩm",
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src={record.image}
              alt={text}
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
            <span>{text}</span>
          </div>
        ),
      },
      {
        title: "Màu sắc",
        dataIndex: "color",
        key: "color",
      },
      {
        title: "Kích thước",
        dataIndex: "size",
        key: "size",
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        render: (price) => `${price?.toLocaleString()}đ`,
      },
      {
        title: "Thành tiền",
        dataIndex: "totalPrice",
        key: "totalPrice",
        render: (total) => `${total?.toLocaleString()}đ`,
      },
    ];

    return <Table columns={columns} dataSource={order.products} pagination={false} />;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Thông tin khách hàng">
        <Descriptions column={2}>
          <Descriptions.Item label="Họ tên">{name}</Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={role === "admin" ? "geekblue" : "green"}>{role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(createdAt).toLocaleDateString()}
          </Descriptions.Item>
          {introduction && (
            <Descriptions.Item label="Giới thiệu" span={2}>
              {introduction}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: "24px" }}>
        <TabPane tab="Thông tin ví" key="1">
          <Card>
            <Descriptions column={2}>
              <Descriptions.Item label="Số dư">
                {wallet?.balance?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Số giao dịch">
                {wallet?.transactionCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Lịch sử giao dịch" key="2">
          <Table
            columns={transactionColumns}
            dataSource={wallet?.transactions}
            rowKey="momoTransactionId"
          />
        </TabPane>

        <TabPane tab="Lịch sử đơn hàng" key="3">
          <Table
            columns={orderColumns}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.products?.length > 0,
            }}
            dataSource={orders?.items}
            rowKey="orderId"
          />
        </TabPane>

        <TabPane tab="Địa chỉ giao hàng" key="4">
          <Card>
            {address?.map((addr, index) => (
              <Card.Grid key={index} style={{ width: "100%" }}>
                <Descriptions>
                  <Descriptions.Item label="Địa chỉ">
                    {addr.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại">
                    {addr.addressType}
                  </Descriptions.Item>
                </Descriptions>
              </Card.Grid>
            ))}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UserDetail;