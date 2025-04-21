import React, { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Select, Modal, message, Switch } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import usedeactiveuser from "./usedectiveuser";
import { useUserAdmin } from "./useuseradmin";
import { Link } from "react-router-dom";
import AdminBreadcrumb from "../../../../components/admin/AdminBreadcrumb";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ListUserAdmin = () => {
  const { data, isLoading } = useUserAdmin();
  const { mutate, isLoading: isLoadingdeactive } = usedeactiveuser();
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

  // Hàm xử lý xóa người dùng
  const handleDelete = (userId, userName) => {
    confirm({
      title: "Xác nhận xóa người dùng",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa người dùng "${userName}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        console.log("Xóa người dùng:", userId);
        message.success(`Đã xóa người dùng ${userName}`);
      },
      onCancel() {
        console.log("Hủy xóa");
      },
    });
  };

  const columns = [
    {
      title: "Tên",
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
      title: "Trang thái",
      dataIndex: "active",
      key: "active",
      render: (active, record) => {
        const handleStatusChange = () => {
          Modal.confirm({
            title: `${active ? "Vô hiệu hóa" : "Kích hoạt"} tài khoản`,
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc chắn muốn ${
              active ? "vô hiệu hóa" : "kích hoạt"
            } tài khoản của "${record.name}"?`,
            okText: "Xác nhận",
            okType: active ? "danger" : "primary",
            cancelText: "Hủy",
            onOk() {
              console.log("id1", record._id);

              mutate(record._id);
            },
          });
        };

        return (
          <Space>
            <Tag color={active ? "green" : "volcano"}>
              {active ? "Active" : "Inactive"}
            </Tag>
            <Switch
              checked={active}
              onChange={handleStatusChange}
              loading={isLoadingdeactive}
            />
          </Space>
        );
      },
    },
    {
      title: "Số Dư",
      key: "balance",
      render: (text, record) => (record.wallet ? (record.wallet.balance.toLocaleString())  : 0),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <a href={`/admin/detail/${record._id}`}>Xem chi tiết</a>
          {/* <a href={`/admin/edit/${record._id}`} style={{ color: "#1890ff" }}>
        cập nhật
      </a> */}
          {/* <a href={`/admin/customers/edit/${record._id}`}>Edit</a>
          <a
            onClick={() => handleDelete(record._id, record.name)}
            style={{ color: "#ff4d4f" }}
          >
            Delete
          </a> */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AdminBreadcrumb />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Danh sách người dùng{" "}
        </h1>
        <Link
          to="/admin/adduseradmin"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thêm tài khoản user
        </Link>
      </div>
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
