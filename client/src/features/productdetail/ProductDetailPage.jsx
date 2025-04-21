import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import usegetoneproduct from "./usegetproduct";
import { useParams } from "react-router-dom";
import ReviewCart from "../reviews/ReviewCart";
import RatingStarts from "../../components/RatingStarts";
import { getBaseUrl } from "../../utils/baseURL";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = usegetoneproduct(id);
  console.log("data", data);
  const productReviews = data?.reviews || [];

  const colorVariants = useMemo(() => {
    // console.log(data?.product);
    if (!data?.product?.variants) return {};
    const grouped = {};
    data.product.variants.forEach((variant) => {
      grouped[variant.color] = variant.sizes;
    });
    return grouped;
  }, [data?.product?.variants]);

  const uniqueColors = useMemo(
    () => Object.keys(colorVariants),
    [colorVariants]
  );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Tự động chọn màu đầu tiên
  React.useEffect(() => {
    if (uniqueColors.length > 0 && !selectedColor) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [uniqueColors, selectedColor]);

  // Lấy danh sách size cho màu đã chọn
  const availableSizes = useMemo(() => {
    return colorVariants[selectedColor]?.map((size) => size.size) || [];
  }, [selectedColor, colorVariants]);

  // Tìm variant được chọn
  const selectedVariant = useMemo(() => {
    return colorVariants[selectedColor]?.find(
      (size) => size.size === selectedSize
    );
  }, [selectedColor, selectedSize, colorVariants]);

  // Xử lý tăng giảm số lượng
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    const maxQuantity = selectedVariant?.quantity || 10;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn đầy đủ màu sắc và kích thước!");
      return;
    }

    const cartItem = {
      productId: data.product._id,
      title: data.product.title,
      image: data.product.image?.[0]?.url || "https://via.placeholder.com/300",
      brand: data.product.brand,
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant?.price || data.product.originalPrice,
      quantity: quantity,
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/v1/carts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(cartItem),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sản phẩm đã được thêm vào giỏ hàng! 🛒");
      } else {
        alert(`Thêm vào giỏ hàng thất bại: ${data.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.product) return <div>Product not found</div>;

  const product = data.product;

  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          {/* Hình ảnh sản phẩm */}
          <div className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200">
            <img
              alt={product.title}
              src={
                product.image?.length
                  ? product.image[0].url
                  : "https://via.placeholder.com/300"
              }
              className="w-full h-auto rounded"
            />
            <div className="flex justify-center mt-6">
              {product.image?.slice(1, 4).map((img, index) => (
                <div
                  key={index}
                  className="w-1/4 h-auto mx-2 border border-gray-200 rounded"
                >
                  <img
                    alt={`related ${index}`}
                    src={img.url}
                    className="w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {product.brand}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {product.title}
            </h1>
            <h1>{product.description}</h1>

            {/* Giá sản phẩm */}
            <div className="mt-6">
              <span className="title-font font-medium text-2xl text-gray-900 mr-4">
                {selectedVariant ? (
                  <>
                    <del className="text-gray-500">
                      ${product.originalPrice}
                    </del>{" "}
                    <span className="text-red-500">
                      ${selectedVariant.price}
                    </span>
                  </>
                ) : (
                  `$${product.originalPrice}`
                )}
              </span>
            </div>
            {/* số lượng  */}
            <div className="flex items-center mb-4">
              <span className="mr-3">Số lượng:</span>

              {/* Nút giảm số lượng */}
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>

              {/* Input hiển thị số lượng */}
              <input
                type="text"
                className="w-12 py-1 text-center border-x border-gray-300 focus:outline-none"
                value={quantity}
                readOnly
              />

              {/* Nút tăng số lượng */}
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none"
                onClick={incrementQuantity}
                disabled={
                  selectedVariant && quantity >= selectedVariant.quantity
                }
              >
                +
              </button>
            </div>

            {/* Chọn màu & kích cỡ */}
            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
              <div className="flex">
                <span className="mr-3">Màu sắc:</span>
                {uniqueColors.map((color, index) => (
                  <button
                    key={index}
                    className={`border-2 ml-1 rounded-full w-6 h-6 focus:outline-none
                      ${
                        color.toLowerCase() === "đỏ"
                          ? "bg-red-500"
                          : color.toLowerCase() === "xanh"
                          ? "bg-blue-500"
                          : color.toLowerCase() === "vàng"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      } 
                      ${
                        selectedColor === color
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize("");
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
            <RatingStarts rating={product.rating} />

            {/* Hiển thị số lượng */}
            <div className="text-gray-600 mb-4">
              {selectedVariant
                ? `Số lượng còn lại: ${selectedVariant.quantity}`
                : "Vui lòng chọn màu & kích cỡ"}
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center mb-4">
              <span className="mr-3">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="w-12 py-1 text-center border-x border-gray-300 focus:outline-none"
                  value={quantity}
                  readOnly
                />
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none"
                  onClick={incrementQuantity}
                  disabled={
                    selectedVariant && quantity >= selectedVariant.quantity
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Thêm vào giỏ hàng */}
            <div className="flex mt-8">
              <button
                className="text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Section bình luận và đánh gía  */}
        <section className="mt-8">
          <ReviewCart productReviews={productReviews} />
        </section>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-[36px]">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
