import React, { useState, useEffect } from "react"; // Add useEffect import

import { Upload, Input, Select, Button, Form, Radio, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions";
import useUppdateProduct from "./useUppdateProduct";
import useGetOneProduct from "../../../productdetail/usegetproduct";
import useCategory from "../addProductadmin/usecategory";
import { useParams } from "react-router-dom";
import ProductVariantManager from "../addProductadmin/ProductVariantManager";
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
  const existingVariant = variants.find(
    (v) => v.color.toLowerCase() === currentVariant.color.toLowerCase()
  );
  console.log(existingVariant);

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

const UppdateProductAdmin = () => {
  
  const { id } = useParams();
 
  const { data, isLoadingProduct } = useGetOneProduct(id);
  const { mutate, isLoading } = useUppdateProduct();
  const { category, loading } = useCategory();

  console.log("cate", category);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]); // Lưu trữ các thẻ sản phẩm
  const [images, setImages] = useState([]); // Quản lý ảnh trong state của ProductsAdmin
  console.log("images", images);
  const [variants, setVariants] = useState([]); // Quản lý biến thể sản phẩm
  const [existingVariants, setExistingVariants] = useState([]); // Store existing variants for comparison
  // console.log(variants);

  useEffect(() => {
    if (data?.product) {
      const product = data.product;
      // console.log(category)

      const selectedCategory = category?.data?.find(
        (cat) => cat._id === product.category
      );

      product.category = selectedCategory.name;
      form.setFieldsValue({
        title: product.title,
        brand: product.brand,
        category: product.category,
        description: product.description,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
      });

      setImages(product.image || []);
      setTags(product.tag || []);
      // console.log(category.data)

      // Tạo lại các biến thể với dữ liệu có sẵn
      const transformedVariants =
        product.variants?.flatMap((variant) =>
          variant.sizes.map((size) => ({
            key: `${variant.color}-${size.size}`,
            color: variant.color,
            size: size.size,
            price: size.price,
            quantity: size.quantity,
            isExisting: true, // Đánh dấu các biến thể có sẵn
          }))
        ) || [];
      // console.log(transformedVariants)

      setVariants(transformedVariants);
      setExistingVariants(product.variants || []); // Lưu biến thể đã tồn tại để kiểm tra trùng
    }
  }, [data, form, category]);

  const handleAddImages = (newImages) => {
    setImages(newImages); // Cập nhật lại ảnh sau khi thêm ảnh
  };

  // Update cloudinaryUpload to return object with url and public_id
  const cloudinaryUpload = async (uploadOptions) => {
    const { files, uploadPreset, width, height } = uploadOptions;

    const newImages = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      return { formData };
    });

    const imgObjects = await Promise.all(
      newImages?.map(async (img) => {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dsenpijts/image/upload",
          {
            method: "POST",
            body: img.formData,
          }
        );

        const data = await response.json();

        // Return object with url and public_id
        return {
          url: cld
            .image(data.public_id)
            .resize(Resize.scale().width(width).height(height))
            .quality("auto")
            .format("auto")
            .toURL(),
          public_id: data.public_id,
        };
      })
    );

    return imgObjects;
  };

  // Update handleUpload to work with image objects
  const handleUpload = async ({ file }) => {
    try {
      const imgObjects = await cloudinaryUpload({
        files: [file],
        uploadPreset: "upploads",
        width: 500,
        height: 500,
      });

      setImages((prev) => [...prev, ...imgObjects]);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload failed");
    }
  };

  // Update handleDelete to work with image objects
  const handleDelete = (imageToDelete) => {
    const newImages = images.filter(
      (img) => img.public_id !== imageToDelete.public_id
    );
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

  // Update handleAddVariant to check for duplicates
  const handleAddVariant = (newVariant) => {
    const isDuplicate = [...existingVariants, ...variants].some(
      (v) =>
        v.color.toLowerCase() === newVariant.color.toLowerCase() &&
        v.size.toLowerCase() === newVariant.size.toLowerCase()
    );

    if (isDuplicate) {
      message.error(
        `Biến thể màu "${newVariant.color}" với size "${newVariant.size}" đã tồn tại!`
      );
      return;
    }

    setVariants((prev) => [...prev, newVariant]); // Thêm biến thể vào danh sách hiện tại
  };

  const onFinish = (values) => {
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
      formattedVariants.push({
        color: color,
        sizes: variantsByColor[color],
      });
    });

    const productData = {
      ...values,
      id,
      variants: formattedVariants,
      image: images,
      tag: tags,
    };

    mutate(productData);
  };
  if (loading) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Cập nhật Sản phẩm</h1>
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
              // console.log("image", image),
              <div
                className="relative w-28 h-28 800px:w-36 800px:h-36 group"
                key={index}
              >
                <img
                  src={image.url}
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
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("You can only upload image files!");
              }
              return isImage;
            }}
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
              {loading ? (
                <Option disabled>Đang tải danh mục...</Option>
              ) : category?.data && category.data.length > 0 ? (
                category?.data?.map((categoryItem) => (
                  <Option key={categoryItem._id} value={categoryItem.name}>
                    {categoryItem?.name} 
                  </Option>
                ))
              ) : (
                <Option disabled>Không có danh mục</Option> // Hiển thị nếu không có danh mục
              )}
            </Select>
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

        <Form.Item
          label="Giá khuyến mãi"
          name="salePrice"
          dependencies={["originalPrice"]}
          rules={[
            {
              validator: async (_, value) => {
                if (!value) return Promise.resolve();

                const originalPrice = Number(
                  form.getFieldValue("originalPrice")
                );
                if (!originalPrice) {
                  return Promise.reject("Vui lòng nhập giá gốc trước!");
                }

                const salePriceValue = Number(value);
                const discountPercentage =
                  ((originalPrice - salePriceValue) / originalPrice) * 100;

                if (salePriceValue >= originalPrice) {
                  return Promise.reject(
                    "Giá khuyến mãi phải thấp hơn giá gốc!"
                  );
                }

                if (discountPercentage < 50) {
                  return Promise.reject(
                    "Giảm giá không được vượt quá 50% giá gốc!"
                  );
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

        <ProductVariantManager
          variants={variants}
          setVariants={setVariants}
          handleAddVariant={handleAddVariant} // Pass the updated function
        />

        <Form.Item className="py-5">
          <Button type="primary" htmlType="submit">
            Cập nhật sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UppdateProductAdmin;

// UppdateProductAdmin
