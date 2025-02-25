import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductDetailPageTest = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const colorVariants = useMemo(() => {
    // Dữ liệu mẫu về các biến thể màu sắc và kích cỡ
    const productVariants = [
      {
        color: "Đỏ",
        size: "M",
        price: 100,
        quantity: 10,
      },
      {
        color: "Đỏ",
        size: "L",
        price: 120,
        quantity: 5,
      },
      {
        color: "Xanh",
        size: "M",
        price: 110,
        quantity: 8,
      },
      {
        color: "Xanh",
        size: "S",
        price: 90,
        quantity: 0,
      },
    ];

    const grouped = {};
    productVariants.forEach((variant) => {
      if (!grouped[variant.color]) {
        grouped[variant.color] = [];
      }
      grouped[variant.color].push({
        size: variant.size,
        price: variant.price,
        quantity: variant.quantity,
      });
    });
    return grouped;
  }, []);

  const uniqueColors = useMemo(() => Object.keys(colorVariants), [colorVariants]);

  useEffect(() => {
    if (uniqueColors.length > 0 && !selectedColor) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);

  const availableSizes = useMemo(
    () => colorVariants[selectedColor]?.map((variant) => variant.size) || [],
    [selectedColor, colorVariants]
  );

  const selectedVariant = useMemo(
    () =>
      colorVariants[selectedColor]?.find((variant) => variant.size === selectedSize),
    [selectedColor, selectedSize, colorVariants]
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng!");
      return;
    }

    const cartItem = {
      id: "product-id", // ID sản phẩm mẫu
      title: "Sản phẩm mẫu",
      image: "https://via.placeholder.com/300", // Hình ảnh mẫu
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant?.price || 100, // Giá mẫu
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Sản phẩm đã được thêm vào giỏ hàng! 🛒");
  };

  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          {/* Hình ảnh sản phẩm */}
          <div className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200">
            <img
              alt="Product"
              src="https://via.placeholder.com/300"
              className="w-full h-auto rounded"
            />
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              Sản phẩm mẫu
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              Tên sản phẩm
            </h1>
            <h1>Mô tả sản phẩm</h1>

            {/* Giá sản phẩm */}
            <div className="mt-6">
              <span className="title-font font-medium text-2xl text-gray-900 mr-4">
                {selectedVariant ? (
                  <>
                    <del className="text-gray-500">$150</del>{" "}
                    <span className="text-red-500">${selectedVariant.price}</span>
                  </>
                ) : (
                  "$100"
                )}
              </span>
            </div>

            {/* Chọn màu & kích cỡ */}
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
              <div className="flex">
                <span className="mr-3">Màu sắc:</span>
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`border-2 ml-1 rounded-full w-6 h-6 ${
                      selectedColor === color ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize(""); // Reset size khi đổi màu
                    }}
                  />
                ))}
              </div>
              <div className="flex ml-6 items-center">
                <span className="mr-3">Kích cỡ:</span>
                <select
                  className="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-red-500 text-base pl-3 pr-10"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Chọn kích cỡ</option>
                  {availableSizes.map((size, index) => (
                    <option key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hiển thị số lượng */}
            <div className="text-gray-600">
              {selectedVariant
                ? `Số lượng còn lại: ${selectedVariant.quantity}`
                : "Vui lòng chọn màu & kích cỡ"}
            </div>

            {/* Thêm vào giỏ hàng */}
            <div className="flex mt-8" onClick={handleAddToCart}>
              <button className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPageTest;
