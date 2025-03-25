import React, { useState } from "react";
import { productCategories } from "../../../../utils/products";
import { Upload, Input, Select, Button, Form, Radio, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";
import useaddproductadmin from "./useaddproductadmin";
import useCategory from "./usecategory";
import ProductVariantManager from "./ProductVariantManager";

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
  const { mutate, isLoading } = useaddproductadmin();
  const { category, loading } = useCategory();
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const handleAddImages = (newImages) => {
    setImages(newImages);
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
  // console.log(variants)
  const onFinish = (values) => {
  
    const productData = { ...values };

    const formattedVariants = [];

    const variantsByColor = {};
    variants.forEach((variant) => {
      if (!variantsByColor[variant.color]) {
        variantsByColor[variant.color] = [];
      }
      variantsByColor[variant.color].push({
        size: variant.size,
        quantity: variant.quantity,
        price: variant.price,
      });
    });

    Object.keys(variantsByColor).forEach((color) => {
      console.log(color);
      formattedVariants.push({
        color: color,
        sizes: variantsByColor[color],
      });
    });
    console.log(formattedVariants);

    productData.variants = formattedVariants;
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

          {/* <Form.Item
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
          </Form.Item> */}
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
          label="Giá gốc sản phẩm"
          name="originalPrice"
          rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
        >
          <Input type="number" placeholder="Nhập giá sản phẩm" />
        </Form.Item>

        {/* Thêm trường giá khuyến mãi */}
        <Form.Item
          label="Giá khuyến mãi"
          name="salePrice"
          dependencies={["originalPrice"]}
          rules={[
            {
              validator: async (_, value) => {
                
                const originalPrice = Number(form.getFieldValue("originalPrice"));
                const salePriceValue = Number(value);
        
               
                if (!value) return Promise.resolve();
                
               
                if (!originalPrice) {
                  return Promise.reject("Vui lòng nhập giá gốc trước!");
                }
        
               
                const discountPercentage = ((originalPrice - salePriceValue) / originalPrice) * 100;
               
                if (salePriceValue >= originalPrice) {
                  return Promise.reject("Giá khuyến mãi phải thấp hơn giá gốc!");
                }
                console.log(discountPercentage)
                if (discountPercentage < 50) {
                  return Promise.reject("Giảm giá không được vượt quá 50% giá gốc!");
                }
        
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Nhập giá khuyến mãi (không bắt buộc)"
          />
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

        <ProductVariantManager variants={variants} setVariants={setVariants} />

        {/* Phí vận chuyển */}
        {/* <Form.Item
          name="shippingFee"
          label="Phí vận chuyển"
          rules={[{ required: true, message: "Vui lòng nhập phí vận chuyển!" }]}
        >
          <Input type="number" placeholder="Nhập phí vận chuyển" />
        </Form.Item> */}

        <Form.Item  className="py-5">
          <Button type="primary" htmlType="submit">
            Đăng ký sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductsAdmin;
