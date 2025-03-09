import React from "react";
import { useParams } from "react-router-dom";
import { Card, Descriptions, Table, Tag, Image, Divider } from "antd";
import useGetOneProduct from "../../../productdetail/usegetproduct";

const ProductDetailAdmin = () => {
  const params = useParams();
console.log("Params:", params);
const { id } = params;
console.log("ID:", id);

  //  const { id } = useParams();
  // console.log(id)
  const { data, isLoading } = useGetOneProduct(id);

  if (isLoading) return <div>Loading...</div>;

  const product = data?.product;
  console.log(product)

  // Cấu hình cho bảng variants
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
  ];

  return (
    <div className="p-6">
      <Card title="Chi tiết sản phẩm" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
          <div>
            <h3 className="text-lg font-semibold mb-4">Hình ảnh sản phẩm</h3>
            <div className="flex flex-wrap gap-2">
              {product?.image?.map((img, index) => (
            
                <Image
                  key={index}
                  src={img.url}
                  alt={`Product ${index + 1}`}
                  width={120}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          </div>

          {/* Thông tin cơ bản */}
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên sản phẩm">
              {product?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {product?.brand}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              {product?.category}
            </Descriptions.Item>
            <Descriptions.Item label="Tình trạng">
              <Tag
                color={
                  product?.condition === "new"
                    ? "green"
                    : product?.condition === "used"
                    ? "orange"
                    : "blue"
                }
              >
                {product?.condition === "new"
                  ? "Mới"
                  : product?.condition === "used"
                  ? "Đã sử dụng"
                  : "Gần như mới"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Giá gốc">
              {product?.originalPrice?.toLocaleString()}đ
            </Descriptions.Item>
            <Descriptions.Item label="Phí vận chuyển">
              {product?.shippingFee?.toLocaleString()}đ
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Mô tả sản phẩm */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
          <p className="whitespace-pre-line">{product?.description}</p>
        </div>

        {/* Tags */}
        {product?.tag?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tag.map((tag, index) => (
                <Tag key={index} color="cyan">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Biến thể sản phẩm */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Biến thể sản phẩm</h3>
          <Table
            columns={variantColumns}
            dataSource={product?.variants}
            rowKey={(record) => record.color}
            pagination={false}
          />
        </div>

        {/* Trạng thái */}
        <Divider />
        <Descriptions column={2}>
          <Descriptions.Item label="Trạng thái">
            <Tag color={product?.isDeleted ? "red" : "green"}>
              {product?.isDeleted ? "Đã xóa" : "Đang bán"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(product?.createdAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProductDetailAdmin;
