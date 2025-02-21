import React, { useState } from "react";
import { Table, Image, Input, Select ,Tag} from "antd";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { Option } = Select;

const fetchProducts = async (query) => {
  // Lọc bỏ các tham số có giá trị rỗng hoặc undefined
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value && value.trim() !== "")
  );
  
  const { data } = await axios.get("http://localhost:5000/api/v1/product", { params: filteredQuery });
  return data;
};

const ListproductAdmin = () => {
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
    enabled: Object.values(filters).some(value => value && value.trim() !== ""),  // Bỏ các giá trị rỗng khỏi query
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
    { title: "Thương hiệu", dataIndex: "brand", key: "brand" },
    { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true },
    { title: "Giá gốc", dataIndex: "originalPrice", key: "originalPrice", render: (price) => `${price} VND`, sorter: (a, b) => a.originalPrice - b.originalPrice },
    { title: "Giá giảm", dataIndex: "salePrice", key: "salePrice", render: (price) => (price ? `${price} VND` : "Không giảm giá"), sorter: (a, b) => (a.salePrice || 0) - (b.salePrice || 0) },
    { title: "Phí vận chuyển", dataIndex: "shippingFee", key: "shippingFee", render: (fee) => `${fee} VND` },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    { title: "Thẻ", dataIndex: "tag", key: "tag", render: (tags) => tags?.join(", ") || "Không có thẻ" },
    { title: "Biến thể", dataIndex: "variants", key: "variants", render: (variants) => variants?.map(v => `${v.color} - ${v.size}`).join(", ") || "Không có biến thể" },
    { title: "Hình ảnh", dataIndex: "image", key: "image", render: (images) => images?.length > 0 ? <Image width={50} src={images[0].url} /> : "Không có ảnh" },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: (status) => <Tag color={status === "sale" ? "green" : "red"}>{status}</Tag> },
    { title: "Điều kiện", dataIndex: "condition", key: "condition", render: (condition) => <Tag color={condition === "new" ? "blue" : "volcano"}>{condition}</Tag> },
    { title: "Đánh giá", dataIndex: "rating", key: "rating", sorter: (a, b) => a.rating - b.rating },
    { title: "Số lượng đánh giá", dataIndex: "ratingQuantity", key: "ratingQuantity", sorter: (a, b) => a.ratingQuantity - b.ratingQuantity },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Tìm kiếm theo tên" value={filters.title} onChange={(e) => handleFilterChange("title", e.target.value)} style={{ width: 200, marginRight: 8 }} />
        <Select placeholder="Trạng thái" value={filters.status} onChange={(value) => handleFilterChange("status", value)} style={{ width: 150, marginRight: 8 }}>
          <Option value="">Tất cả</Option>
          <Option value="sale">Sale</Option>
          <Option value="under reservation">Under Reservation</Option>
          <Option value="sold out">Sold Out</Option>
          <Option value="hide">Hide</Option>
        </Select>
        <Select placeholder="Điều kiện" value={filters.condition} onChange={(value) => handleFilterChange("condition", value)} style={{ width: 150, marginRight: 8 }}>
          <Option value="">Tất cả</Option>
          <Option value="new">New</Option>
          <Option value="used">Used</Option>
          <Option value="semiused">Semiused</Option>
        </Select>
        <Select placeholder="Sắp xếp" value={filters.sort} onChange={(value) => handleFilterChange("sort", value)} style={{ width: 150 }}>
          <Option value="originalPrice">Giá gốc</Option>
          <Option value="salePrice">Giá giảm</Option>
          <Option value="rating">Đánh giá</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={Object.values(filters).some(value => value && value.trim() !== "") ? filteredData?.products : data?.products} loading={isLoading || isFiltering} rowKey="_id" />
    </div>
  );
};

export default ListproductAdmin;