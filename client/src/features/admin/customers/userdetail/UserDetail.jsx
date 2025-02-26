import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Table, Tag, Tabs } from "antd";
import { useUserDetail } from "./useUserDetail";

const { TabPane } = Tabs;

const UserDetail = () => {
  const { userId } = useParams();
  const { data, isLoading } = useUserDetail(userId);

  if (isLoading) return <div>Loading...</div>;

  const { name, email, photo, role, introduction, createdAt, wallet, address } =
    data?.data || {};

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "momoTransactionId",
      key: "momoTransactionId",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString()}đ`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "pending"
              ? "processing"
              : "error"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Customer Information">
        <Descriptions column={2}>
          <Descriptions.Item label="Name">{name}</Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={role === "admin" ? "geekblue" : "green"}>{role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(createdAt).toLocaleDateString()}
          </Descriptions.Item>
          {introduction && (
            <Descriptions.Item label="Introduction" span={2}>
              {introduction}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginTop: "24px" }}>
        <TabPane tab="Wallet Information" key="1">
          <Card>
            <Descriptions column={2}>
              <Descriptions.Item label="Balance">
                {wallet?.balance?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Total Deposits">
                {wallet?.totalDeposits?.toLocaleString()}đ
              </Descriptions.Item>
              <Descriptions.Item label="Transaction Count">
                {wallet?.transactionCount}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Transaction History" key="2">
          <Table
            columns={transactionColumns}
            dataSource={wallet?.transactions}
            rowKey="momoTransactionId"
          />
        </TabPane>

        <TabPane tab="Shipping Addresses" key="3">
          <Card>
            {address?.map((addr, index) => (
              <Card.Grid key={index} style={{ width: "100%" }}>
                <Descriptions>
                  <Descriptions.Item label="Address">
                    {addr.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
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
