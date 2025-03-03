import { Link } from "react-router-dom";
import React from "react";

const Card = ({ product }) => {
  return (
    <Link
      className="bg-white transform overflow-hidden duration-200 hover:scale-105 cursor-pointer"
      to={`/products/${product._id}`}
    >
      <img
        className="w-full"
        src={product.image?.[0]?.url || "https://via.placeholder.com/500"}
        alt={product.title}
      />
      <div className="p-4 text-black/[0.9]">
        <h2 className="text-lg font-medium">{product.title}</h2>
        <div className="flex items-center text-black/[0.5]">
          <p className="mr-2 text-lg font-semibold">{product.originalPrice}đ</p>
          {product.originalPrice && (
            <p className="text-base font-medium line-through">
              {product.originalPrice * 1.2}đ
            </p>
          )}
          <p className="ml-auto text-base text-green-500">20% off</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
