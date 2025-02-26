import React, { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Select } from "antd";
import { useUserAdmin } from "./useuseradmin";

const { Search } = Input;
const { Option } = Select;

const ListUserAdmin = () => {
  const { data, isLoading } = useUserAdmin();
  console.log(data);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    if (data?.user) {
      setFilteredUsers(data.user);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  const users = data?.user || [];

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    filterData(value, roleFilter, activeFilter);
  };

  // Xử lý lọc theo vai trò
  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    filterData(searchTerm, value, activeFilter);
  };

  // Xử lý lọc theo trạng thái hoạt động
  const handleActiveFilter = (value) => {
    setActiveFilter(value);
    filterData(searchTerm, roleFilter, value);
  };

  // Hàm lọc dữ liệu
  const filterData = (search, role, active) => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (active !== null) {
      filtered = filtered.filter((user) => user.active === active);
    }

    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "geekblue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Tag color={active ? "green" : "volcano"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Balance",
      dataIndex: "accountBalance",
      key: "balance",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <a href={`/admin/customers/detail/${record._id}`}>Xem chi tiết</a>
          <a href={`/admin/customers/edit/${record._id}`}>Edit</a>
          <a href={`/users/delete/${record._id}`}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>User List</h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
        {/* Ô tìm kiếm */}
        <Search
          placeholder="Tìm kiếm theo tên hoặc email"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />

        {/* Bộ lọc theo vai trò */}
        <Select
          placeholder="Lọc theo vai trò"
          allowClear
          onChange={handleRoleFilter}
          style={{ width: 200 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>

        {/* Bộ lọc theo trạng thái hoạt động */}
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          onChange={handleActiveFilter}
          style={{ width: 200 }}
        >
          <Option value={true}>Active</Option>
          <Option value={false}>Inactive</Option>
        </Select>
      </div>

      {/* Bảng danh sách người dùng */}
      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
    </div>
  );
};

export default ListUserAdmin;
