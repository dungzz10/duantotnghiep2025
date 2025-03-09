import React, { useState } from "react";
import { Button, Row, Col, Spin } from "antd";
import Card from "./Card";
import { useAllProducts } from "./useProducts"; // Đảm bảo đường dẫn đúng

const Products = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } = useAllProducts({limit:8});

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Lỗi khi tải sản phẩm!</div>;

  return (
    <div className="section px-2 800px:px-0">
      <h1 className="font-bold text-2xl my-6">Các sản phẩm có sẵn</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-14 px-5 md:px-0">
  {data?.pages.flatMap((page) =>
    page.products.map((product) => (
      <Card key={product._id} product={product} />
    ))
  )}
</div>

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
