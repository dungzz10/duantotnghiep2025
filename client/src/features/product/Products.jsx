import React from "react";
import Card from "./Card";

const Products = () => {
  return (
    <div className="section px-2 800px:px-0">
      <h1 className="font-bold text-2xl my-6 ">Các sản ohaamr có sẵn </h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from(Array(12)).map((item) => (
          <Card key={item} />
        ))}
      </div>
    </div>
  );
};

export default Products;
