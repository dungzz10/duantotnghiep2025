import React, { useState, useEffect } from "react";
import { Table, Space, Tag, Input, Select, Button, message, Modal, Image } from "antd";
import { Link } from "react-router-dom";
import { useCategoriesAdmin } from "./usecategoriesadmin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Search } = Input;
const { Option } = Select;

const ListCategoriesAdmin = () => {
  const { data, isLoading } = useCategoriesAdmin();
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

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    filterData(value.toLowerCase(), roleFilter, activeFilter);
  };

  const filterData = (search, role, active) => {
    let filtered = data?.data || [];

    if (search) {
      filtered = filtered.filter((category) =>
        category.name.toLowerCase().includes(search)
      );
    }

    if (role) {
      filtered = filtered.filter((category) => category.role === role);
    }

    if (active !== null) {
      filtered = filtered.filter((category) => category.active === active);
    }

    setFilteredCategories(filtered);
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    filterData(searchTerm, value, activeFilter);
  };

  const handleActiveFilter = (value) => {
    setActiveFilter(value);
    filterData(searchTerm, roleFilter, value);
  };

  const HandleRemoveCategory = async (id) => {
    Modal.confirm({
      title: 'Xóa danh mục',
      content: 'Bạn có chắc muốn xóa danh mục?',
      okText: 'Đồng ý',
      cancelText: 'Từ chối',
      onOk: async () => {
        const loading = message.loading({ content: 'Đang tải...', duration: 0 });
        try {
          await axios.delete(`http://localhost:5000/api/v1/categories/${id}/delete`);
          message.success('Xóa danh mục thành công!', 3);
  
          // Update the state to remove the deleted category
          setFilteredCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== id)
          );
        } catch (error) {
          message.error('Lỗi khi xóa danh mục', 5);
        } finally {
          loading();
        }
      },
      onCancel: () => {
        message.success('Hủy!');
      },
    });
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      key: 'image',
      render: (_, item) => <Image style={{ width: 50, height: 50 }} src={item.image} alt="" />,
    },
    {
      title: "Hành động",
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
      <div style={{ marginBottom: 16, display: "flex", gap: "10px" }}>
        <Search
          placeholder="Tìm kiếm theo tên"
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredCategories} rowKey="_id" />
    </div>
  );
};

export default ListCategoriesAdmin;