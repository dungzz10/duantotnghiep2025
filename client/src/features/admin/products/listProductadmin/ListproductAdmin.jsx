import React, { useState } from "react";
 import { useNavigate } from "react-router-dom";
import {
  Table,
  Image,
  Input,
  Select,
  Tag,
  Button,
  Popconfirm,
  message,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Option } = Select;

const fetchProducts = async (query) => {
  // 
  // Lọc bỏ các tham số có giá trị rỗng hoặc undefined
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value && value.trim() !== "")
  );

  const { data } = await axios.get(
    "http://localhost:5000/api/v1/product/getall/",
    { params: filteredQuery }
  );
  console.log(data);
  return data;
};

const ListproductAdmin = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    title: "",
    status: "",
    condition: "",
    sort: "originalPrice",
  });

  // Query 1: Lấy tất cả sản phẩm
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts({}),
  });

  // Query 2: Lọc sản phẩm
  const { data: filteredData, isLoading: isFiltering } = useQuery({
    queryKey: ["filteredProducts", filters],
    queryFn: () => fetchProducts(filters),
    enabled: Object.values(filters).some(
      (value) => value && value.trim() !== ""
    ), // Bỏ các giá trị rỗng khỏi query
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/product/delete/${id}`);
      message.success("Sản phẩm đã được xóa");

      fetchProducts(filters);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleRestoreProduct = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/product/khoiphuc/${id}`);
      message.success("Sản phẩm đã được khôi phục");

      fetchProducts(filters);
    } catch (error) {
      message.error("Có lỗi xảy ra khi khôi phục sản phẩm");
    }
  };

  const handleUpdateProduct = (id) => {
     navigate(`/admin/products/update/${id}`);
    // Code để cập nhật sản phẩm (ví dụ, mở modal để cập nhật thông tin sản phẩm)
    console.log(`Chỉnh sửa sản phẩm có ID: ${id}`);
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
    { title: "Thương hiệu", dataIndex: "brand", key: "brand" },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Giá gốc",
      dataIndex: "originalPrice",
      key: "originalPrice",
      render: (price) => `${price} VND`,
      sorter: (a, b) => a.originalPrice - b.originalPrice,
    },
    {
      title: "Giá giảm",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (price) => (price ? `${price} VND` : "Không giảm giá"),
      sorter: (a, b) => (a.salePrice || 0) - (b.salePrice || 0),
    },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "sale" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Trạng thái xóa",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) =>
        isDeleted ? (
          <Tag color="volcano">Đã xóa</Tag>
        ) : (
          <Tag color="green">Còn hàng</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleUpdateProduct(record._id)}
            style={{ marginRight: 8 }}
          >
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record._id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
          {record.isDeleted && (
            <Popconfirm
              title="Bạn có chắc chắn muốn khôi phục sản phẩm này?"
              onConfirm={() => handleRestoreProduct(record._id)}
            >
              <Button type="primary">Khôi phục</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên"
          value={filters.title}
          onChange={(e) => handleFilterChange("title", e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Select
          placeholder="Trạng thái"
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          style={{ width: 150, marginRight: 8 }}
        >
          <Option value="">Tất cả</Option>
          <Option value="sale">Sale</Option>
          <Option value="under reservation">Under Reservation</Option>
          <Option value="sold out">Sold Out</Option>
          <Option value="hide">Hide</Option>
        </Select>
        <Select
          placeholder="Điều kiện"
          value={filters.condition}
          onChange={(value) => handleFilterChange("condition", value)}
          style={{ width: 150, marginRight: 8 }}
        >
          <Option value="">Tất cả</Option>
          <Option value="new">New</Option>
          <Option value="used">Used</Option>
          <Option value="semiused">Semiused</Option>
        </Select>
        <Select
          placeholder="Sắp xếp"
          value={filters.sort}
          onChange={(value) => handleFilterChange("sort", value)}
          style={{ width: 150 }}
        >
          <Option value="originalPrice">Giá gốc</Option>
          <Option value="salePrice">Giá giảm</Option>
          <Option value="rating">Đánh giá</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={
          Object.values(filters).some((value) => value && value.trim() !== "")
            ? filteredData?.products
            : data?.products
        }
        loading={isLoading || isFiltering}
        rowKey="_id"
        pagination={{
          pageSize: 4, // Số lượng sản phẩm mỗi trang (đã thay đổi thành 4 sản phẩm mỗi trang)
        }}
      />
    </div>
  );
};

export default ListproductAdmin;
