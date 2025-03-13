import React, { useState } from "react";
import { Button, Spin } from "antd";
import Card from "./Card";
import { useAllProducts } from "./useProducts";

const Products = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useAllProducts({ limit: 8 });

  // Sample data to match the image
  const sampleProducts = [
    {
      _id: "1",
      title: "Poutsicle Hydrating Lip Stain",
      brand: "REVLON",
      originalPrice: 200.0,
      discountPrice: 150.0,
      discountPercentage: 15,
      isNew: true,
      image: [{ url: "https://via.placeholder.com/500" }],
      rating: 5,
      ratingCount: 50,
      countdown: "00 : 00 : 00 : 00",
    },
    {
      _id: "2",
      title: "Velvet Red Charm",
      brand: "AQUA KISS",
      originalPrice: 200.0,
      discountPrice: 150.0,
      discountPercentage: 25,
      image: [{ url: "https://via.placeholder.com/500" }],
      rating: 5,
      ratingCount: 50,
    },
    {
      _id: "3",
      title: "Hydrating Waves",
      brand: "SEA BREEZE",
      originalPrice: 200.0,
      discountPrice: 150.0,
      discountPercentage: 15,
      image: [{ url: "https://via.placeholder.com/500" }],
      rating: 5,
      ratingCount: 50,
      sizeOptions: ["250 ml", "500 ml", "1000 ml", "1500 ml"],
    },
  ];

  const productsToShow =
    data?.pages.flatMap((page) => page.products) || sampleProducts;

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Lỗi khi tải sản phẩm!</div>;

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-8">Best Selling Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {productsToShow.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8 mb-16">
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage}
            className="px-8 py-2 bg-black text-white hover:bg-gray-800"
          >
            Tải thêm sản phẩm
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;
