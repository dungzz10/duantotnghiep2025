import React, { useState } from "react";
import { Button, Row, Col, Spin } from "antd";
import Card from "./Card";
import { useAllProducts } from "./useProducts"; // Đảm bảo đường dẫn đúng

const Products = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useAllProducts();

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Lỗi khi tải sản phẩm!</div>;

  return (
    <div className="section px-2 800px:px-0">
      <h1 className="font-bold text-2xl my-6">Các sản phẩm có sẵn</h1>
      <Row gutter={[16, 16]}>
        {data.pages.map((page) =>
          page.products.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card product={product} />
            </Col>
          ))
        )}
      </Row>
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()} // Tải thêm sản phẩm khi nhấn
          disabled={!hasNextPage} // Chỉ cho phép nhấn khi có thêm sản phẩm
          style={{ marginTop: 20 }}
        >
          Tải thêm sản phẩm
        </Button>
      )}
    </div>
  );
};

export default Products;
