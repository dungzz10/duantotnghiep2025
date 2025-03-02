import React, { useState } from "react";
import { Table, Button, Space, Modal, message, Tag } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import UserAdminForm from "../updateadmin/UserAdminForm";

const UserAdminList = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  // Fetch admin users
  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/user/admin",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
  });

  // Deactivate user mutation
  const deactivateUser = useMutation({
    mutationFn: async (userId) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/user/admin/deactive/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Vô hiệu hóa tài khoản thành công");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  // Update user mutation
  const updateUser = useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/user/admin/uppdate/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật tài khoản thành công");
      setEditModalVisible(false);
      setSelectedUser(null);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleUpdate = (values) => {
    console.log("value", values);
    if (selectedUser) {
      updateUser.mutate({
        userId: selectedUser._id,
        userData: values,
      });
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = role === "super admin" ? "red" : "blue";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
   
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "success" : "error"}>
          {active ? "Hoạt động" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedUser(record);
              setEditModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() => {
              Modal.confirm({
                title: record.active
                  ? "Xác nhận vô hiệu hóa"
                  : "Xác nhận kích hoạt",
                content: `Bạn có chắc muốn ${
                  record.active ? "vô hiệu hóa" : "kích hoạt"
                } tài khoản ${record.name}?`,
                onOk: () => deactivateUser.mutate(record._id),
              });
            }}
          >
            {record.active ? "Vô hiệu hóa" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Admin</h1>
        <Button type="primary" onClick={() => setEditModalVisible(true)}>
          Thêm Admin
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data?.users}
        loading={isLoading}
        rowKey="_id"
      />

      {editModalVisible && (
        <UserAdminForm
          visible={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default UserAdminList;
