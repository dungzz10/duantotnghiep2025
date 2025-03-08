import React, { useState, useMemo } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import ReviewCart from "../reviews/ReviewCart";
import ProductDetailsCarousel from "./ProductDetailsCarousel";
import usegetoneproduct from "./usegetproduct";
import SizeGuide from "./sizeGuide";
import RelatedProducts from "./RelatedProducts";
import RatingStarts from "../../components/RatingStarts";

const SingelProduct = () => {
  const { id } = useParams();
  const { data, isLoading, error } = usegetoneproduct(id);
  const [showSizeError, setShowSizeError] = useState(false);
  console.log("data", data);
  const productReviews = data?.reviews || [];

  // Cập nhật logic xử lý variants
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    const cartItem = {
      id: data.product._id,
      title: data.product.title,
      image: data.product.image?.length
        ? data.product.image[0].url
        : "https://via.placeholder.com/300",
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant?.price || data.product.originalPrice,
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.product) return <div>Product not found</div>;

  const product = data.product;

  const handleAddToFavorites = () => {
    const favoriteItem = {
      id: data.product._id,
      title: data.product.title,
      image: data.product.image?.length
        ? data.product.image[0].url
        : "https://via.placeholder.com/300",
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant?.price || data.product.originalPrice,
    };

    const existingFavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    const existingIndex = existingFavorites.findIndex(
      (item) =>
        item.id === favoriteItem.id &&
        item.color === favoriteItem.color &&
        item.size === favoriteItem.size
    );

    if (existingIndex === -1) {
      existingFavorites.push(favoriteItem);
      localStorage.setItem("favorites", JSON.stringify(existingFavorites));
      alert("Sản phẩm đã được thêm vào yêu thích! ❤️");
    } else {
      alert("Sản phẩm đã có trong danh sách yêu thích.");
    }
  };

  return (
    <div className="w-full md:py-20">
      <Wrapper>
        <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
          {/* left colums start */}
          <div
            className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full
    mx-auto lg:mx-0
    "
          >
            <ProductDetailsCarousel product={product.image} />
          </div>
          {/* left colums end */}

          {/* right colums start */}
          <div className="flex-[1] py-3">
            {/* Tiêu đề  */}
            <div className="text-[34px] font-semibold mb-2">
              {product.title}
            </div>
            {/* tiêu đề  */}

            {/* Giá sản phẩm */}
            <div className="mt-6">
              <span className="title-font font-medium text-2xl text-gray-900 mr-4">
                {selectedVariant ? (
                  <>
                    <del className="text-gray-500">
                      {product.originalPrice}đ
                    </del>{" "}
                    <span className="text-red-500">
                      {selectedVariant.price}đ
                    </span>
                  </>
                ) : (
                  `${product.originalPrice} VNĐ`
                )}
              </span>
            </div>
            {/* hãng  */}
            <div className="text-lg font-semibold mt-5 mb-5 text-black/50">
              Hãng: {product.brand}
            </div>
            <RatingStarts rating={product.rating} />
            <div className="text-md font-medium text-black/[0.5]">
              Đã bao gồm thuế
            </div>
            <div className="text-md font-medium text-black/[0.5] mb-20">
              {`(Bao gồm tất cả các loại thuế và phí áp dụng)`}
            </div>

            {/* PRODUCT SIZE RANGEW START */}
            <div className="mb-10">
              {/* HEADING START */}
              <div className="flex justify-between items ">
                <div className="text-md font-semibold">Chọn kích cỡ</div>
                <div className="text-md font-medium text-black/[0.5]">
                  <SizeGuide />
                </div>
              </div>
              {/* HEADING END */}

              {/* SIZE START */}
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size) => (
                  <div
                    key={size}
                    className={`border rounded-md text-center py-3 font-medium hover:border-black cursor-pointer
                ${selectedSize === size ? "border-black bg-gray-200" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
              {/* SIZE END */}
              {/* chọn màu  */}
              <div className="flex mt-5">
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

              {/* SHOW ERROR START */}
              {showSizeError && !selectedSize && (
                <div className="text-red-600 mt-1">Vui lòng chọn kích cỡ</div>
              )}
              {/* SHOW ERROR END */}

              {/* SHOW ERROR END */}
            </div>
            {/* PRODUCT SIZE RANGEW END */}

            {/* ADD TO CARD BUTTON START */}
            <button
              className="w-full py-4 rounded-full bg-black
                    text-white text-lg font-medium transition-transform
                    active:scale-95 mb-3 hover:opacity-75"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
            {/* ADD TO CARD BUTTON END */}

            {/* WHISLIST BUTTON START */}
            <button
              className="w-full py-4 rounded-full border border-black
             text-lg font-medium transition-transform
             flex items-center justify-center gap-2 hover:opacity-75 mb-10"
              onClick={handleAddToFavorites}
            >
              Yêu thích
              <IoMdHeartEmpty size={20} />
            </button>
            {/* WHISLIST BUTTON END */}

            <div>
              <div className="text-lg font-bold mb-5">Chi tiết sản phẩm</div>
              <div className="text-md mb-5">
                Mô tả sản phẩm này sẽ giúp bạn trải nghiệm tốt nhất khi chơi
                golf.
              </div>
            </div>
          </div>
          {/* right colums end */}
        </div>
        <section className="mt-8">
          <ReviewCart productReviews={productReviews} />
        </section>
        <RelatedProducts />
      </Wrapper>
    </div>
  );
};

export default SingelProduct;
