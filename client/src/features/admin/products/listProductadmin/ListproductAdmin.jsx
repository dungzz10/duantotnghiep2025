import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Tag,
  Table,
  Image,
  Input,
  Select,
  Button,
  Popconfirm,
  message,
  DatePicker,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const { Option } = Select;

const fetchProducts = async (query) => {
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
    startDate: "",
    endDate: "",
  });

  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/product/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Sản phẩm đã được xóa");
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["filteredProducts"]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm"
      );
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/product/khoiphuc/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Sản phẩm đã được khôi phục");
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["filteredProducts"]);
    },
    onError: (error) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi khôi phục sản phẩm"
      );
    },
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? `-${value}` : value,
    }));
  };
  const handleDeleteProduct = (id) => {
    deleteMutation.mutate(id);
  };

  const handleRestoreProduct = (id) => {
    restoreMutation.mutate(id);
  };

  const handleUpdateProduct = (id) => {
    navigate(`/admin/update/${id}`);
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
    { title: "Danh mục", dataIndex: "categoryName", key: "category" },
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Chi tiết",
      key: "details",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/products/detail/${record._id}`)}
        >
          Xem chi tiết
        </Button>
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
          {!record.isDeleted ? (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa sản phẩm này?"
              onConfirm={() => handleDeleteProduct(record._id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button danger loading={deleteMutation.isLoading}>
                Xóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Bạn có chắc chắn muốn khôi phục sản phẩm này?"
              onConfirm={() => handleRestoreProduct(record._id)}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button type="primary" loading={restoreMutation.isLoading}>
                Khôi phục
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl font-semibold text-gray-800">Danh sách sản phẩm </h1>
        <Link to="/admin/addproductadmin" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Thêm sản phẩm 
        </Link>
      </div>
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
          <Option value="">Trạng thái</Option>
          <Option value="sale">Sale</Option>
          <Option value="sold out">Sold Out</Option>
          <Option value="new">new</Option>
        </Select>

        <Select
          placeholder="Sắp xếp"
          value={filters.sort}
          onChange={(value) => handleFilterChange("sort", value)}
          style={{ width: 150, marginRight: 8 }}
        >
          <Option value="originalPrice">Giá gốc</Option>
          <Option value="salePrice">Giá giảm</Option>
          <Option value="rating">Đánh giá</Option>
          <Option value="-createdAt">Ngày tạo</Option>
          <Option value="-updatedAt">Uppdate Gần nhất </Option>
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
