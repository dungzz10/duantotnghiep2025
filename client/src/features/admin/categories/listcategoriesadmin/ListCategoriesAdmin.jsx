import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Tag,
  Input,
  Select,
  Button,
  message,
  Modal,
  Image,
} from "antd";
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
      title: "Xác nhận xóa danh mục",
      content:
        "Khi xóa danh mục, tất cả sản phẩm thuộc danh mục này cũng sẽ bị xóa. Bạn có chắc chắn muốn xóa?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        const loading = message.loading({
          content: "Đang xóa...",
          duration: 0,
        });
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/v1/categories/${id}/delete`
          );
          if (response.status === 200) {
            message.success(
              "Xóa danh mục và các sản phẩm liên quan thành công!"
            );
            // Refresh the categories list
            setFilteredCategories((prevCategories) =>
              prevCategories.filter((category) => category._id !== id)
            );
          }
        } catch (error) {
          message.error(
            error.response?.data?.message || "Lỗi khi xóa danh mục và sản phẩm"
          );
        } finally {
          loading();
        }
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
      key: "image",
      render: (_, item) => (
        <Image style={{ width: 50, height: 50 }} src={item.image} alt="" />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, item) => (
        <>
          <Link to={`/admin/categories/edit/${item._id}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <EditOutlined />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => HandleRemoveCategory(item._id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
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
