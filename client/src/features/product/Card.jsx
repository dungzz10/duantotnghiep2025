import { Link } from "react-router-dom";
import React from "react";

const Card = ({ product }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure>
       
        <Link to={`/products/${product._id}`}>
          <img
            src={product.image?.length ? product.image[0].url : "https://via.placeholder.com/300"}
            alt={product.title}
            className="h-56 w-full object-cover"
          />
        </Link>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title">
          <Link to={`/product/${product._id}`} className="hover:text-blue-500">
            {product.title}
          </Link>
          <div className="badge badge-neutral p-2 rounded-lg uppercase">{product.brand}</div>
          {product.status === "sale" && <div className="badge badge-primary">SALE</div>}
        </h2>
        <h1 className="text-2xl font-bold text-red-500">
          {product.salePrice ? `$${product.salePrice}` : `$${product.originalPrice}`}
        </h1>
        {product.salePrice && (
          <p className="text-sm text-gray-500 line-through">Original: ${product.originalPrice}</p>
        )}
        <p className="text-sm">{product.description}</p>
        <div className="card-actions justify-start mt-2">
          {product.tag?.map((tag, index) => (
            <div key={index} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>
        <p className="text-sm font-light text-gray-400 mt-2">
          {new Date(product.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Card;
