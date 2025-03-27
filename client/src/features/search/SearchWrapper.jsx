import React, { useState } from "react";
import Card from "../product/Card";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";

function SearchWrapper(props) {
  const {
    price,
    setPrice,
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    q,
    setsearchParam,
    brand,
    category,
    setBrand,
    setCategory,
  } = props;
  
  const products = data?.pages.map((page) => page.products).flat();
  // console.log("page",data?.pages)
  const { brandArray, catArray } = data?.pages[0];
  const [originalPrice, setOriginalPrice] = useState("");
  const [filterIndex, setFilterIndex] = useState(0);

  const removequery = () => {
    setsearchParam({ q: "" });
  };

  const resetAllFilters = () => {
    setCategory("");
    setBrand("");
    setPrice("");
    if (q) {
      setsearchParam({ q });
    }
  };

  return (
    <section className="max-w-8xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center"></h1>

      
      <div className="mt-8 flex gap-4 mb-2 w-full">
        {["category", "brand", "price"].map((label, index) => (
          <div
            key={index}
            onClick={() => setFilterIndex(index)}
            className={`w-48 h-12 cursor-pointer px-6 rounded-full ${
              filterIndex === index
                ? "bg-success text-white"
                : "ring-1 text-neutral"
            } flex items-center justify-between`}
          >
            <p>
              {label === "category" && category
                ? `${label}: ${category}`
                : label === "brand" && brand
                ? `${label}: ${brand}`
                : label === "price" && price
                ? `${label}: ${price.originalPrice || ""}`
                : label}
            </p>
            {filterIndex === index ? <BsChevronDown /> : <BsChevronUp />}
          </div>
        ))}
      </div>

      {/* Categories */}
      {filterIndex === 0 && (
        <div className="w-full ring-1 rounded-md bg-slate-100 ring-slate-400 p-6">
          <h2 className="font-bold text-left">
            Tất Cả Danh mục  ({catArray.length})
          </h2>
          <div className="divider my-1 border-slate-400"></div>
          <div className="flex gap-2 flex-wrap">
            {catArray.map((cat) => (
              <p
                key={cat._id}
                className={`cursor-pointer text-left p-2 ${
                  category === cat._id ? "bg-success text-white rounded-md" : ""
                }`}
                onClick={() => setCategory(cat._id)}
              >
                {cat._id} <strong>({cat.count})</strong>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Brands */}
      {filterIndex === 1 && (
        <div className="w-full ring-1 rounded-md bg-slate-100 ring-slate-400 p-6">
          <h2 className="font-bold text-left">
            Tất Cả Nhãn Hiệu  ({brandArray.length})
          </h2>
          <div className="divider my-1 border-slate-400"></div>
          <div className="flex gap-4 flex-wrap items-center">
            {brandArray.map((item) => (
              <p
                key={item._id}
                className={`cursor-pointer text-left p-2 ${
                  brand === item._id ? "bg-success text-white rounded-md" : ""
                }`}
                onClick={() => setBrand(item._id)}
              >
                {item._id} <strong>({item.count})</strong>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      {filterIndex === 2 && (
        <div className="w-full ring-1 rounded-md bg-slate-100 ring-slate-400 p-6">
          <h2 className="font-bold text-left">Lọc Theo Giá </h2>
          <div className="flex gap-3 my-2">
            <label
              className={`cursor-pointer px-3 py-1 rounded-md ${
                price && price.operator === "lt" ? "bg-success text-white" : "bg-gray-200"
              }`}
              onClick={() => setPrice({ originalPrice, operator: "lt" })}
            >
              Giá nhỏ hơn
            </label>
            <label
              className={`cursor-pointer px-3 py-1 rounded-md ${
                price && price.operator === "gt" ? "bg-success text-white" : "bg-gray-200"
              }`}
              onClick={() => setPrice({ originalPrice, operator: "gt" })}
            >
              Giá lớn hơn
            </label>
            <label
              className={`cursor-pointer px-3 py-1 rounded-md ${
                price && !price.operator ? "bg-success text-white" : "bg-gray-200"
              }`}
              onClick={() => setPrice({ originalPrice })}
            >
              Giá bằng
            </label>
          </div>
          <div className="flex gap-8 items-center flex-wrap py-2">
            <input
              type="number"
              placeholder="Input price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
      )}

      {/* Filter Reset */}
      <div className="flex w-full mt-6 gap-5 flex-wrap items-center">
        <div 
          className="text-gray-500 flex items-center cursor-pointer hover:text-success"
          onClick={resetAllFilters}
        >
          <p className="mr-4">Reset Lọc </p> <HiOutlineRefresh />
        </div>
        
        {category && (
          <button
            onClick={() => setCategory("")}
            className="btn btn-sm lowercase btn-success font-semibold rounded-full"
          >
            Danh Mục : {category} ×
          </button>
        )}

        {brand && (
          <button
            onClick={() => setBrand("")}
            className="btn btn-sm lowercase btn-success font-semibold rounded-full"
          >
            Hãng : {brand} ×
          </button>
        )}

        {price && (
          <button
            onClick={() => setPrice("")}
            className="btn btn-sm lowercase btn-success font-semibold rounded-full"
          >
            Price: {price.operator ? `${price.operator} ` : "="}{originalPrice} ×
          </button>
        )}

        {q && (
          <button
            onClick={removequery}
            className="btn lowercase btn-sm btn-success font-semibold rounded-full"
          >
            Search: {q} ×
          </button>
        )}
      </div>

      {/* Filtered Products */}
      <h1 className="font-bold text-2xl my-6">Sản Phảm Đã Lọc </h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0 ? (
          products.map((item) => (
            <Card key={item._id} product={item} />
          ))
        ) : (
          <h1 className="text-4xl font-black py-24 text-gray-300 col-span-full text-center">
            NO Product match your filter
          </h1>
        )}
      </div>
      
      {hasNextPage && (
        <div className="text-center mt-8">
          <button 
            onClick={() => fetchNextPage()} 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}

export default SearchWrapper;