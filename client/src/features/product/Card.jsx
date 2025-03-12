import { Link } from "react-router-dom";
import React from "react";

const Card = ({ product }) => {
  // Calculate discount percentage
  const discountPercentage = product.discountPercentage || 
    (product.originalPrice && product.discountPrice 
      ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100) 
      : 20);
  
  return (
    <Link
      className="bg-white transform overflow-hidden duration-200 hover:scale-105 cursor-pointer relative border border-gray-200 rounded-md flex flex-col h-full"
      to={`/products/${product._id}`}
    >
      <div className="relative">
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">
            NEW
          </div>
        )}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">
            -{discountPercentage}%
          </div>
        )}
        <img
          className="w-full h-64 object-cover"
          src={product.image?.[0]?.url || "https://via.placeholder.com/500"}
          alt={product.title}
        />
        {product.countdown && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
            <div className="bg-white border border-gray-200 px-4 py-1 text-center text-sm">
              {product.countdown}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 text-black/[0.9] flex flex-col flex-grow">
        <h2 className="text-lg font-medium mb-1">{product.title}</h2>
        <div className="text-gray-500 text-sm mb-2">{product.brand}</div>
        <div className="flex items-center text-black/[0.9] mt-auto">
          <p className="mr-2 text-lg font-semibold">${product.discountPrice || product.originalPrice}</p>
          {product.discountPrice && (
            <p className="text-base font-medium line-through text-gray-400">
              ${product.originalPrice}
            </p>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-1">({product.ratingCount || 0})</span>
          </div>
        )}
        {product.sizeOptions && (
          <div className="flex gap-2 mt-2">
            {product.sizeOptions.map((size, index) => (
              <div key={index} className="border border-gray-300 text-xs px-2 py-1 rounded">
                {size}
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Card;