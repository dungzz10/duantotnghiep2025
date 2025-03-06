import React, { useState } from "react";
import Card from "../product/Card";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { HiOutlineRefresh } from "react-icons/hi";

const catArray = [
  { _id: "clothes", count: 4 },
  { _id: "shoes", count: 6 },
  { _id: "gaming", count: 2 },
  { _id: "bags", count: 2 },
  { _id: "others", count: 1 },
  { _id: "computer", count: 5 },
];

const brandArray = [
  { _id: "hp", count: 2 },
  { _id: "dasein", count: 1 },
  { _id: "logitech", count: 1 },
  { _id: "sony", count: 1 },
  { _id: "chicwish", count: 1 },
  { _id: "nike", count: 4 },
  { _id: "bose", count: 1 },
  { _id: "lg", count: 2 },
  { _id: "aquaus", count: 1 },
  { _id: "no brand", count: 6 },
];

function SearchWrapper(props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    q,
    setsearchParam,
  } = props;
  console.log(data);
  const products = data?.pages.map((page) => page.products).flat();
  console.log(products);
  const [filterIndex, setFilterIndex] = useState(0);
  const [price, setPrice] = useState(5);
  const removequery = () => {
    setsearchParam({ q: "" });
  };

  return (
    <section className="section p-2">
      <h1 className="text-3xl font-bold text-center"></h1>

      {/* Filter Buttons */}
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
            <p>{label}</p>
            {filterIndex === index ? <BsChevronDown /> : <BsChevronUp />}
          </div>
        ))}
      </div>

      {/* Categories */}
      {filterIndex === 0 && (
        <div className="w-full ring-1 rounded-md bg-slate-100 ring-slate-400 p-6">
          <h2 className="font-bold text-left">
            All Categories ({catArray.length})
          </h2>
          <div className="divider my-1 border-slate-400"></div>
          <div className="flex gap-2 flex-wrap">
            {catArray.map((cat) => (
              <p key={cat._id} className="cursor-pointer text-left p-2">
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
            All Brands ({brandArray.length})
          </h2>
          <div className="divider my-1 border-slate-400"></div>
          <div className="flex gap-4 flex-wrap items-center">
            {brandArray.map((brand) => (
              <p key={brand._id} className="cursor-pointer text-left p-2">
                {brand._id} <strong>({brand.count})</strong>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      {filterIndex === 2 && (
        <div className="w-full ring-1 rounded-md bg-slate-100 ring-slate-400 p-6">
          <h2 className="font-bold text-left">Filter by Price</h2>
          <div className="divider my-1 border-slate-400"></div>
          <div className="flex gap-8 items-center flex-wrap py-2">
            <input
              type="number"
              placeholder="Input price"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
      )}

      {/* Filter Reset */}
      <div className="flex w-full mt-6 gap-5 flex-wrap items-center">
        <div className="text-gray-500 flex items-center cursor-pointer">
          <p className="mr-4">Reset Filters</p> <HiOutlineRefresh />
        </div>
        <button
        
         
          className={`btn btn-sm lowercase btn-success font-semibold rounded-full`}
        >
          Catagory
        </button>

        <button
        
         
          className={`btn btn-sm lowercase btn-success font-semibold rounded-full`}
        >
          Brand
        </button>

        <button
        
         
          className={`btn btn-sm lowercase btn-success font-semibold rounded-full`}
        >
          Price
        </button>

        <button
          disabled={!q}
          onClick={removequery}
          className={`btn lowercase btn-sm btn-success font-semibold rounded-full`}
        >
          Search
        </button>

        <button
        
         
          className={`btn lowercase btn-sm btn-success font-semibold rounded-full`}
        >
          tags
        </button>
      </div>

      {/* Filtered Products */}
      <h1 className="font-bold text-2xl my-6">Filtered Products</h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products ? (
					products.map((item, index) =>
						index + 1 === products.length ? (
							<Card
								
								key={item._id}
								product={item}
							/>
						) : (
							<Card key={item._id} product={item} />
						)
					)
				) : (
					<h1 className="text-4xl font-black py-24 text-gray-300">
						NO Product match your filter
					</h1>
				)}

			
      </div>
    </section>
  );
}

export default SearchWrapper;
