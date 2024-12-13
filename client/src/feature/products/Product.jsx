import React from "react";
import Card from "./Card";

const Product = () => {
  return (
    <div className="section px-2 800px:px-0">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card></Card>
      </div>
    </div>
  );
};

export default Product;
