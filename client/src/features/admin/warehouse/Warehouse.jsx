import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Descriptions,
  Divider,
  Card,
} from "antd";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AdminBreadcrumb from "../../../components/admin/AdminBreadcrumb";

const { Search } = Input;

const fetchProducts = async () => {
  const { data } = await axios.get(
    "http://localhost:5000/api/v1/product/getall/"
  );
  return data;
};

const Warehouse = () => {
  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/product/delete/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Sản phẩm đã được xóa");
      queryClient.invalidateQueries(["products"]); // This will trigger a re-fetch
    },
    onError: (error) => {
      console.error(error);
      message.error("Có lỗi xảy ra khi xóa sản phẩm");
    },
  });

  const handleDeleteProduct = async (id) => {
    deleteProductMutation.mutate(id);
  };

  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantModal, setVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
    setSelectedProduct(null);
  };

  // Mutations
  const addVariantMutation = useMutation({
    mutationFn: async ({ productId, data }) => {
      const response = await axios.post(
        `http://localhost:5000/api/v1/product/${productId}/variants`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm biến thể thành công");
      queryClient.invalidateQueries(["products"]);
      setVariantModal(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Lỗi khi thêm biến thể");
    },
  });

  const updateVariantMutation = useMutation({
    mutationFn: async ({ productId, variantId, data }) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/product/${productId}/variants/${variantId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật biến thể thành công");
      queryClient.invalidateQueries(["products"]);
    },
  });

  const deleteVariantMutation = useMutation({
    mutationFn: async ({ productId, variantId }) => {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/product/${productId}/variants/${variantId}`
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Xóa biến thể thành công");
      queryClient.invalidateQueries(["products"]);
    },
  });

  // Handlers
  const handleAddVariant = async (data) => {
    await addVariantMutation.mutateAsync({
      productId: selectedProduct._id,
      data,
    });
  };

  const handleUpdateVariant = async (productId, variantId, values) => {
    await updateVariantMutation.mutateAsync({
      productId,
      variantId,
      data: values,
    });
  };

  const handleDeleteVariant = async (productId, variantId) => {
    await deleteVariantMutation.mutateAsync({
      productId,
      variantId,
    });
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    editForm.setFieldsValue({
      color: variant.color,
      size: variant.sizes[0]?.size,
      price: variant.sizes[0]?.price,
      quantity: variant.sizes[0]?.quantity,
    });
  };

  const handleUpdateVariantSubmit = async (data) => {
    await updateVariantMutation.mutateAsync({
      productId: selectedProduct._id,
      variantId: editingVariant._id,
      data,
    });

    setEditingVariant(null);
    editForm.resetFields();
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredProducts = data?.products?.filter((product) =>
    product.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Variant Modal
  const VariantForm = () => {
    const [sizes, setSizes] = useState([{ size: "", price: 0, quantity: 0 }]);

    const addSize = () => {
      setSizes([...sizes, { size: "", price: 0, quantity: 0 }]);
    };

    const removeSize = (index) => {
      setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index, field, value) => {
      const newSizes = [...sizes];
      newSizes[index][field] = value;
      setSizes(newSizes);
    };

    const onFinish = (values) => {
      const data = {
        color: values.color,
        sizes: sizes.map((size) => ({
          size: size.size,
          price: size.price,
          quantity: size.quantity,
        })),
      };
      handleAddVariant(data);
    };

    return (
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="color"
          label="Màu sắc"
          rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
        >
          <Input placeholder="Nhập màu sắc" />
        </Form.Item>

        {sizes.map((size, index) => (
          <div key={index} className="flex gap-4 items-start">
            <Form.Item
              label={index === 0 ? "Kích thước" : ""}
              required
              style={{ flex: 1 }}
            >
              <Input
                placeholder="Nhập kích thước"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label={index === 0 ? "Giá" : ""}
              required
              style={{ flex: 1 }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                value={size.price}
                onChange={(value) => handleSizeChange(index, "price", value)}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              label={index === 0 ? "Số lượng" : ""}
              required
              style={{ flex: 1 }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                value={size.quantity}
                onChange={(value) => handleSizeChange(index, "quantity", value)}
              />
            </Form.Item>

            {index > 0 && (
              <Button
                type="link"
                danger
                onClick={() => removeSize(index)}
                style={{ marginTop: index === 0 ? 32 : 0 }}
              >
                Xóa
              </Button>
            )}
          </div>
        ))}

        <Form.Item>
          <Space>
            <Button type="dashed" onClick={addSize}>
              + Thêm kích thước
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={addVariantMutation.isLoading}
            >
              Thêm biến thể
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  // Table columns
  const variantColumns = [
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Kích thước",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) => (
        <div>
          {sizes.map((size, index) => (
            <div key={index} className="mb-2">
              <Tag color="blue">{size.size}</Tag>
              <span className="ml-2">
                Giá: {size.price.toLocaleString()}đ | SL: {size.quantity}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEditVariant(record)} type="primary">
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa biến thể này?"
            onConfirm={() =>
              handleDeleteVariant(selectedProduct._id, record._id)
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Product columns
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Còn hàng",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) => (
        <Tag color={isDeleted ? "volcano" : "green"}>
          {isDeleted ? "Đã xóa" : "Còn hàng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger loading={deleteProductMutation.isLoading}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            onClick={() => navigate(`/admin/products/detail/${record._id}`)}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
    {
      title: "Biến thể",
      key: "variants",
      render: (_, record) => (
        <Button
          onClick={() => {
            setSelectedProduct(record);
            setVariantModal(true);
          }}
        >
          Quản lý biến thể
        </Button>
      ),
    },
  ];

  const EditVariantModal = () => {
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
      if (editingVariant) {
        setSizes(editingVariant.sizes);
      }
    }, [editingVariant]);

    const addSize = () => {
      setSizes([...sizes, { size: "", price: 0, quantity: 0 }]);
    };

    const removeSize = (index) => {
      setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleSizeChange = (index, field, value) => {
      const newSizes = [...sizes];
      newSizes[index][field] = value;
      setSizes(newSizes);
    };

    const onFinish = (values) => {
      const data = {
        color: values.color,
        sizes: sizes,
      };
      handleUpdateVariantSubmit(data);
    };

    return (
      <Modal
        title="Sửa biến thể"
        open={!!editingVariant}
        onCancel={() => {
          setEditingVariant(null);
          setSizes([]);
        }}
        width={800}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ color: editingVariant?.color }}
        >
          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
          >
            <Input placeholder="Nhập màu sắc" />
          </Form.Item>

          {sizes.map((size, index) => (
            <div key={index} className="flex gap-4 items-start">
              <Form.Item
                label={index === 0 ? "Kích thước" : ""}
                required
                style={{ flex: 1 }}
              >
                <Input
                  placeholder="Nhập kích thước"
                  value={size.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                />
              </Form.Item>

              <Form.Item
                label={index === 0 ? "Giá" : ""}
                required
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={size.price}
                  onChange={(value) => handleSizeChange(index, "price", value)}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                label={index === 0 ? "Số lượng" : ""}
                required
                style={{ flex: 1 }}
              >
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  value={size.quantity}
                  onChange={(value) =>
                    handleSizeChange(index, "quantity", value)
                  }
                />
              </Form.Item>

              <Button
                type="link"
                danger
                onClick={() => removeSize(index)}
                style={{ marginTop: index === 0 ? 32 : 0 }}
              >
                Xóa
              </Button>
            </div>
          ))}

          <Form.Item>
            <Space>
              <Button type="dashed" onClick={addSize}>
                + Thêm kích thước
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateVariantMutation.isLoading}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div>
      <AdminBreadcrumb />
        <h1 className="text-2xl font-semibold text-gray-800">Kho hàng</h1>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm theo tên sản phẩm"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 4 }}
      />

      {selectedProduct && (
        <Modal
          title="Chi tiết sản phẩm"
          visible={visible}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên sản phẩm">
              {selectedProduct.title}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              {selectedProduct.category}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedProduct.isDeleted ? "volcano" : "green"}>
                {selectedProduct.isDeleted ? "Đã xóa" : "Còn hàng"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Thông tin biến thể</Divider>

          {selectedProduct.variants.map((variant) => (
            <Card key={variant._id} style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 16 }}>Màu: {variant.color}</h4>
              <Table
                dataSource={variant.sizes}
                pagination={false}
                columns={[
                  {
                    title: "Kích thước",
                    dataIndex: "size",
                    key: "size",
                  },
                  {
                    title: "Giá",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `${price?.toLocaleString()}đ`,
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                ]}
              />
            </Card>
          ))}
        </Modal>
      )}

      <Modal
        title={`Quản lý biến thể - ${selectedProduct?.title}`}
        open={variantModal}
        onCancel={() => {
          setVariantModal(false);
          setSelectedProduct(null);
          form.resetFields();
        }}
        width={800}
        footer={null}
      >
        <div className="mb-4">
          <h3>Thêm biến thể mới</h3>
          <VariantForm />
        </div>

        <div>
          <h3>Danh sách biến thể</h3>
          <Table
            columns={variantColumns}
            dataSource={selectedProduct?.variants}
            rowKey="_id"
            pagination={false}
          />
        </div>
      </Modal>

      <EditVariantModal />
    </div>
  );
};

export default Warehouse;
