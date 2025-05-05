import React, { useState } from "react";
import { Input, Button, Table, Space, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

const ProductVariantManager = ({ variants, setVariants }) => {
  const [currentVariant, setCurrentVariant] = useState({
    color: "",
    size: "",
    price: "",
    quantity: "",
  });
  const [editingKey, setEditingKey] = useState("");
  const [editingVariant, setEditingVariant] = useState(null);

  // Handle input changes for the new variant form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  // Add new variant
  const handleAddVariant = () => {
    // Validate required fields
    if (
      !currentVariant.color ||
      !currentVariant.size ||
      !currentVariant.price ||
      !currentVariant.quantity
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin biến thể!");
      return;
    }

    // Check for duplicates
    const isDuplicate = variants.some(
      (v) =>
        v.color.toLowerCase() === currentVariant.color.toLowerCase() &&
        v.size.toLowerCase() === currentVariant.size.toLowerCase()
    );

    if (isDuplicate) {
      message.error(
        `Biến thể màu "${currentVariant.color}" với size "${currentVariant.size}" đã tồn tại!`
      );
      return;
    }

   
    const newVariant = {
      ...currentVariant,
      key: `${variants.length + 1}-${currentVariant.color}-${
        currentVariant.size
      }`,
    };
    console.log(newVariant,"newVariant");

    setVariants([...variants, newVariant]);

    // Reset the form
    setCurrentVariant({
      color: "",
      size: "",
      price: "",
      quantity: "",
    });

    message.success("Đã thêm biến thể thành công!");
  };

  // Delete a variant
  const handleDeleteVariant = (key) => {
    const newVariants = variants.filter((item) => item.key !== key);
    setVariants(newVariants);
    message.success("Đã xóa biến thể!");
  };

  // Edit a variant
  const handleEdit = (record) => {
    setEditingKey(record.key);
    setEditingVariant({ ...record });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingKey("");
    setEditingVariant(null);
  };

  // Save edited variant
  const handleSave = (key) => {
    if (!editingVariant) return;

    // Validate required fields
    if (
      !editingVariant.color ||
      !editingVariant.size ||
      !editingVariant.price ||
      !editingVariant.quantity
    ) {
      message.error("Vui lòng nhập đầy đủ thông tin biến thể!");
      return;
    }

    // Check for duplicates (excluding current record)
    const isDuplicate = variants.some(
      (v) =>
        v.key !== key &&
        v.color.toLowerCase() === editingVariant.color.toLowerCase() &&
        v.size.toLowerCase() === editingVariant.size.toLowerCase()
    );

    if (isDuplicate) {
      message.error(
        `Biến thể màu "${editingVariant.color}" với size "${editingVariant.size}" đã tồn tại!`
      );
      return;
    }

    // Update variants array
    const newVariants = variants.map((item) =>
      item.key === key ? { ...editingVariant, key } : item
    );

    setVariants(newVariants);
    setEditingKey("");
    setEditingVariant(null);
    message.success("Đã cập nhật biến thể thành công!");
  };

  // Check if a row is currently being edited
  const isEditing = (record) => record.key === editingKey;

  // Table columns definition
  const columns = [
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: "25%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={editingVariant?.color || text}
            onChange={(e) =>
              setEditingVariant({ ...editingVariant, color: e.target.value })
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
      width: "25%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={editingVariant?.size || text}
            onChange={(e) =>
              setEditingVariant({ ...editingVariant, size: e.target.value })
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            type="number"
            value={editingVariant?.price || text}
            onChange={(e) =>
              setEditingVariant({
                ...editingVariant,
                price: Number(e.target.value),
              })
            }
          />
        ) : (
          `${text?.toLocaleString()} đ`
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            type="number"
            value={editingVariant?.quantity || text}
            onChange={(e) =>
              setEditingVariant({
                ...editingVariant,
                quantity: Number(e.target.value),
              })
            }
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => handleSave(record.key)}
            >
              Lưu
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              onClick={() => handleEdit(record)}
              disabled={editingKey !== ""}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => handleDeleteVariant(record.key)}
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="variants-section border p-4 rounded-lg mt-4">
      <h3 className="font-bold text-lg mb-4">Biến thể sản phẩm</h3>

      {/* Form to add new variants */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Input
          name="color"
          placeholder="Màu sắc"
          value={currentVariant.color}
          onChange={handleInputChange}
        />
        <Input
          name="size"
          placeholder="Kích thước"
          value={currentVariant.size}
          onChange={handleInputChange}
        />
        <Input
          name="price"
          type="number"
          placeholder="Giá"
          value={currentVariant.price}
          onChange={handleInputChange}
        />
        <Input
          name="quantity"
          type="number"
          placeholder="Số lượng"
          value={currentVariant.quantity}
          onChange={handleInputChange}
        />
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddVariant}
        className="mb-4"
      >
        Thêm biến thể
      </Button>

      {/* Table to display variants */}
      <Table
        columns={columns}
        dataSource={variants}
        pagination={false}
        rowClassName="editable-row"
        bordered
      />
    </div>
  );
};

export default ProductVariantManager;
