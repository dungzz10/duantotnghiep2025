import React, { useState } from "react";
import { productCategories } from "../../../../utils/products";
import { Upload, Input, Select, Button, Form, Radio, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";
import useaddproductadmin from "./useaddproductadmin";
import useCategory from "./usecategory";
const { Option } = Select;
const statusData = [
  { name: "Mới", value: "new" },
  { name: "Đã sử dụng", value: "used" },
  { name: "Gần như mới", value: "semiused" },
];

const cld = new Cloudinary({
  cloud: {
    cloudName: "dsenpijts",
    apiKey: "389331339586573",
    apiSecret: "U1KLipj3F_1NwW5cKHPvAVzcsbY",
  },
});

const checkDuplicateVariant = (variants, currentVariant, currentSize) => {
  // Check if color already exists
  const existingVariant = variants.find(
    (v) => v.color.toLowerCase() === currentVariant.color.toLowerCase()
  );

  if (existingVariant) {
    // Check if size already exists for this color
    const duplicateSize = existingVariant.sizes.find(
      (s) => s.size.toLowerCase() === currentSize.size.toLowerCase()
    );

    if (duplicateSize) {
      return {
        isDuplicate: true,
        message: `Biến thể màu "${currentVariant.color}" với size "${currentSize.size}" đã tồn tại!`,
      };
    }
  }

  // Check current variant sizes
  const duplicateInCurrent = currentVariant.sizes.find(
    (s) => s.size.toLowerCase() === currentSize.size.toLowerCase()
  );

  if (duplicateInCurrent) {
    return {
      isDuplicate: true,
      message: `Size "${currentSize.size}" đã tồn tại trong màu "${currentVariant.color}"!`,
    };
  }

  return { isDuplicate: false };
};

const ProductsAdmin = () => {
  const { mutate, isLoading } = useaddproductadmin();
  const { category, loading } = useCategory();
  console.log("cate", category);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]); // Lưu trữ các thẻ sản phẩm
  const [images, setImages] = useState([]); // Quản lý ảnh trong state của ProductsAdmin
  const [variants, setVariants] = useState([]); // Quản lý biến thể sản phẩm
  console.log("variants", variants);
  const [currentVariant, setCurrentVariant] = useState({
    color: "",
    sizes: [],
  });
  const [currentSize, setCurrentSize] = useState({
    size: "",
    quantity: 0,
    price: 0,
  });

  const handleAddImages = (newImages) => {
    setImages(newImages); // Cập nhật lại ảnh sau khi thêm ảnh
  };

  const cloudinaryUpload = async (uploadOptions) => {
    const { files, uploadPreset, width, height } = uploadOptions;

    const newImages = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      return { formData };
    });

    const imgObj = await Promise.all(
      newImages?.map(async (img) => {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dsenpijts/image/upload",
          {
            method: "POST",
            body: img.formData,
          }
        );

        const data = await response.json();

        return cld
          .image(data.public_id)
          .resize(Resize.scale().width(width).height(height))
          .quality("auto")
          .format("auto")
          .toURL();
      })
    );

    return imgObj;
  };

  const handleUpload = async ({ file }) => {
    try {
      const imgObj = await cloudinaryUpload({
        files: [file],
        uploadPreset: "upploads",
        width: 500,
        height: 500,
      });

      const newImages = [...images, ...imgObj];
      setImages(newImages);
      handleAddImages(newImages);
    } catch (error) {
      message.error("Upload failed");
    }
  };

  const handleDelete = (image) => {
    const newImages = images.filter((img) => img !== image);
    setImages(newImages);
    handleAddImages(newImages);
  };

  const handleAddTag = (value) => {
    if (value && tags.length < 4) {
      setTags([...tags, value]);
      form.setFieldsValue({ tagInput: "" });
    } else {
      message.warning("Bạn chỉ có thể thêm tối đa 4 thẻ.");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddSize = () => {
    if (!currentSize.size || !currentSize.quantity || !currentSize.price) {
      message.error("Vui lòng nhập đầy đủ thông tin kích cỡ!");
      return;
    }

    if (!currentVariant.color) {
      message.error("Vui lòng nhập màu sắc trước khi thêm kích cỡ!");
      return;
    }

    // Check for duplicates
    const { isDuplicate, message: errorMessage } = checkDuplicateVariant(
      variants,
      currentVariant,
      currentSize
    );

    if (isDuplicate) {
      message.error(errorMessage);
      return;
    }

    setCurrentVariant((prev) => ({
      ...prev,
      sizes: [...prev.sizes, currentSize],
    }));

    // Reset form size
    setCurrentSize({
      size: "",
      quantity: 0,
      price: 0,
    });

    form.setFieldsValue({
      variantSize: "",
      variantQuantity: "",
      variantPrice: "",
    });
  };

  const handleAddVariant = () => {
    if (!currentVariant.color || currentVariant.sizes.length === 0) {
      message.error("Vui lòng nhập đầy đủ thông tin biến thể!");
      return;
    }

    // Check if color already exists in variants
    const duplicateColor = variants.find(
      (v) => v.color.toLowerCase() === currentVariant.color.toLowerCase()
    );

    if (duplicateColor) {
      message.error(`Màu "${currentVariant.color}" đã tồn tại!`);
      return;
    }

    setVariants((prev) => [...prev, currentVariant]);

    // Reset current variant
    setCurrentVariant({
      color: "",
      sizes: [],
    });

    form.setFieldsValue({
      variantColor: "",
    });
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const onFinish = (values) => {
    const {
      variantColor,
      variantSize,
      variantPrice,
      variantQuantity,
      ...productData
    } = values;

    productData.variants = variants;
    productData.image = images;
    productData.tag = tags;
    console.log(productData);

    mutate(productData);
    message.success("Sản phẩm đã được thêm thành công!");
  };
  if (loading) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Thêm Sản Phẩm</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="w-full"
      >
        {/* Hình ảnh sản phẩm */}
        <Form.Item label="Hình ảnh sản phẩm" name="image">
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                className="relative w-28 h-28 800px:w-36 800px:h-36 group"
                key={index}
              >
                <img
                  src={image}
                  alt={`uploaded-${index}`}
                  className="object-cover w-full h-full rounded-md"
                />
                <DeleteOutlined
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-600 bg-red-500 rounded-full p-1 z-10"
                  onClick={() => handleDelete(image)}
                />
              </div>
            ))}
          </div>
          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            multiple
            accept="image/*"
          >
            <Button icon={<PlusOutlined />}>Add Images</Button>
          </Upload>
        </Form.Item>

        {/* Các trường nhập liệu sản phẩm */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Tên sản phẩm"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item label="Thương hiệu" name="brand">
            <Input placeholder="Nhập thương hiệu sản phẩm" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Danh mục sản phẩm"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              {category?.data?.map((categoryItem) => (
                <Option key={categoryItem._id} value={categoryItem.name}>
                  {categoryItem.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Tình trạng sản phẩm"
            name="condition"
            rules={[
              { required: true, message: "Vui lòng chọn tình trạng sản phẩm!" },
            ]}
          >
            <Radio.Group>
              {statusData.map((sd) => (
                <Radio key={sd.value} value={sd.value}>
                  {sd.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>

        {/* Thêm trường mô tả */}
        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
        >
          <Input.TextArea placeholder="Nhập mô tả sản phẩm" rows={4} />
        </Form.Item>

        {/* Thêm trường giá */}
        <Form.Item
          label="Giá gốc  sản phẩm"
          name="originalPrice"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <Input type="number" placeholder="Nhập giá sản phẩm" />
        </Form.Item>

        <Form.Item label="Thẻ sản phẩm (không bắt buộc)" name="tag">
          <Input.Search
            placeholder="Nhập thẻ (tối đa 4)"
            enterButton="Thêm"
            onSearch={handleAddTag}
          />
          <div className="mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="border px-2 py-1 mr-2 rounded bg-gray-200 inline-flex items-center"
              >
                {tag}
                <button
                  onClick={() => handleTagDelete(tag)}
                  className="ml-2 text-red-500"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </Form.Item>

        {/* Thêm thông tin biến thể */}
        <div className="variants-section border p-4 rounded-lg mt-4">
          <h3 className="font-bold text-lg mb-4">Biến thể sản phẩm</h3>

          {/* Input cho màu sắc */}
          <Form.Item label="Màu sắc" name="variantColor">
            <Input
              placeholder="Nhập màu sắc"
              onChange={(e) =>
                setCurrentVariant((prev) => ({
                  ...prev,
                  color: e.target.value,
                }))
              }
              value={currentVariant.color}
            />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item label="Kích thước" name="variantSize">
              <Input
                placeholder="Nhập kích thước"
                onChange={(e) =>
                  setCurrentSize((prev) => ({ ...prev, size: e.target.value }))
                }
                value={currentSize.size}
              />
            </Form.Item>

            <Form.Item label="Giá" name="variantPrice">
              <Input
                type="number"
                placeholder="Nhập giá"
                onChange={(e) =>
                  setCurrentSize((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                value={currentSize.price}
              />
            </Form.Item>

            <Form.Item label="Số lượng" name="variantQuantity">
              <Input
                type="number"
                placeholder="Nhập số lượng"
                onChange={(e) =>
                  setCurrentSize((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                value={currentSize.quantity}
              />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddSize}>Thêm kích cỡ</Button>
            <Button type="primary" onClick={handleAddVariant}>
              Lưu biến thể
            </Button>
          </div>

          {/* Hiển thị sizes của variant hiện tại */}
          {currentVariant.sizes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">
                Kích cỡ đã thêm cho màu {currentVariant.color}:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {currentVariant.sizes.map((size, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span>
                      Size: {size.size} - Giá: ${size.price} - SL:{" "}
                      {size.quantity}
                    </span>
                    <Button
                      type="text"
                      danger
                      onClick={() =>
                        setCurrentVariant((prev) => ({
                          ...prev,
                          sizes: prev.sizes.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị tất cả variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold">Biến thể đã thêm:</h4>
              {variants.map((variant, idx) => (
                <div key={idx} className="mt-2 p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Màu: {variant.color}</h5>
                    <Button
                      type="text"
                      danger
                      onClick={() =>
                        setVariants((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Xóa
                    </Button>
                  </div>
                  <div className="ml-4">
                    {variant.sizes.map((size, sizeIdx) => (
                      <div key={sizeIdx} className="text-sm text-gray-600">
                        Size: {size.size} - Giá: ${size.price} - SL:{" "}
                        {size.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phí vận chuyển */}
        <Form.Item
          name="shippingFee"
          label="Phí vận chuyển"
          rules={[{ required: true, message: "Vui lòng nhập phí vận chuyển!" }]}
        >
          <Input type="number" placeholder="Nhập phí vận chuyển" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng ký sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductsAdmin;
