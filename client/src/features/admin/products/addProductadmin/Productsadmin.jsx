import React, { useState } from "react";
import { productCategories } from "../../../../utils/products";
import { Upload, Input, Select, Button, Form, Radio, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";

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

const ProductsAdmin = () => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]); // Lưu trữ các thẻ sản phẩm
  const [images, setImages] = useState([]); // Quản lý ảnh trong state của ProductsAdmin
  const [variants, setVariants] = useState([]); // Quản lý biến thể sản phẩm
  console.log("Ảnh trong state:", images);

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
        console.log("Dữ liệu trả về từ Cloudinary:", data); // Log dữ liệu trả về từ Cloudinary

        return cld
          .image(data.public_id)
          .resize(Resize.scale().width(width).height(height))
          .quality("auto")
          .format("auto")
          .toURL();
      })
    );

    console.log("Ảnh đã được xử lý:", imgObj); // Log ảnh sau khi đã xử lý
    return imgObj;
  };

  const handleUpload = async ({ file }) => {
    console.log("File được chọn:", file); // Log file để kiểm tra
    try {
      const imgObj = await cloudinaryUpload({
        files: [file],
        uploadPreset: "upploads",
        width: 500,
        height: 500,
      });

      console.log("Hình ảnh đã được upload:", imgObj);
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

  // Thêm biến thể vào mảng
  const handleAddVariant = () => {
    const variantData = {
      color: form.getFieldValue("variantColor"),
      size: form.getFieldValue("variantSize"),
      price: form.getFieldValue("variantPrice"),
      quantity: form.getFieldValue("variantQuantity"),
    };
    setVariants([...variants, variantData]);
  };

  // Xóa biến thể
  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const onFinish = (values) => {
  

    // Loại bỏ các trường variantColor, variantSize, variantPrice, variantQuantity
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

    console.log("Dữ liệu sản phẩm sau khi xử lý:", productData);
    message.success("Sản phẩm đã được thêm thành công!");

    console.log("Thẻ sản phẩm:", tags);
    console.log("Biến thể sản phẩm:", variants);
    message.success("Sản phẩm đã được thêm thành công!");
  };

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
              {productCategories.map((category) => (
                <Option key={category.id} value={category.title}>
                  {category.title}
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
        <div className="variants-section">
          <h3 className="font-bold text-lg">Biến thể sản phẩm</h3>

          <Form.Item label="Màu sắc" name="variantColor">
            <Input placeholder="Nhập màu sắc" />
          </Form.Item>

          <Form.Item label="Kích thước" name="variantSize">
            <Input placeholder="Nhập kích thước" />
          </Form.Item>

          <Form.Item label="Giá" name="variantPrice">
            <Input type="number" placeholder="Nhập giá" />
          </Form.Item>

          <Form.Item label="Số lượng" name="variantQuantity">
            <Input type="number" placeholder="Nhập số lượng" />
          </Form.Item>

          <Button type="dashed" onClick={handleAddVariant}>
            Thêm biến thể
          </Button>

          {/* Hiển thị các biến thể đã thêm */}
          <div className="variants-list mt-4">
            {variants.map((variant, index) => (
              <div key={index} className="variant-item flex justify-between">
                <span>
                  {variant.color} - {variant.size} - {variant.price} -{" "}
                  {variant.quantity}
                </span>
                <Button
                  type="link"
                  danger
                  onClick={() => handleRemoveVariant(index)}
                >
                  Xóa
                </Button>
              </div>
            ))}
          </div>
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
