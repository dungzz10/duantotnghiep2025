import React, { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Select, Button , message , Modal} from "antd";
import { Link } from "react-router-dom"
import { useCategoriesAdmin } from "./usecategoriesadmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
const { Search } = Input;
const { Option } = Select;

const ListCategoriesAdmin = () => {
  const { data, isLoading } = useCategoriesAdmin();
  // console.log(data.data)
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setFilteredCategories(data.data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;

  const Categories = data?.data || [];

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
    let filtered = Categories;

    if (search) {
      filtered = filtered.filter(
        (Categories) =>
          Categories.name.toLowerCase().includes(search) ||
          Categories.email.toLowerCase().includes(search)
      );
    }

    if (role) {
      filtered = filtered.filter((Categories) => Categories.role === role);
    }

    if (active !== null) {
      filtered = filtered.filter((Categories) => Categories.active === active);
    }

    setFilteredCategories(filtered);
  };


  const HandleRemoveCategory = async (id) => {
    console.log(id)
    try {
      Modal.confirm({
        title: 'Confirm',
        content: 'Are you sure you want to delete this about?',
        okText: 'Yes',
        cancelText: 'No',
        okButtonProps: {
          className: "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" // áp dụng lớp CSS
        },
        onOk: async () => {
          const loading = message.loading({ content: 'Loading...', duration: 0 });
          setTimeout(async () => {
            if (loading) {
              loading();
            }
            message.success('ok')
            const response = await Categories.RemoveCategory(id)
            if (response) {
              message.success('Deleted successfully!', 3);
              const dataNew = data.filter((data) => data._id !== id);
              setFilteredCategories(dataNew);
            }
          }, 2000);
        },
        onCancel: () => {
          message.success('Canceled!');
        },
      });
    } catch (error) {
      message.error('lỗi', 5);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, item) => (
        <>
          <Link to={`/admin/categories/${item._id}/update`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><EditOutlined /></button>
          </Link>
          <button type="button"
            onClick={() => HandleRemoveCategory(item._id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <DeleteOutlined />
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Categories List</h2>

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
          <Option value="Categories">Categories</Option>
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
      <Table columns={columns} dataSource={filteredCategories} rowKey="_id" />
    </div>
  );
};

export default ListCategoriesAdmin;
