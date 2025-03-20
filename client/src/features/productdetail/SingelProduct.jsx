import React, { useState, useMemo, useEffect } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import ReviewCart from "../reviews/ReviewCart";
import ProductDetailsCarousel from "./ProductDetailsCarousel";
import usegetoneproduct from "./usegetproduct";
import SizeGuide from "./sizeGuide";
import RelatedProducts from "./RelatedProducts";
import RatingStarts from "../../components/RatingStarts";
import { api } from "../../axios/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
const SingelProduct = () => {
  const { id } = useParams();
  const { data, isLoading, error } = usegetoneproduct(id);
  const [quantityError, setQuantityError] = useState("");

  const [showSizeError, setShowSizeError] = useState(false);
  console.log("data", data, 111111111111111111);
  const productReviews = data?.reviews || [];
  const [isfavourite, setIsFavourite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  //kiem tra xem san pham da co trong muc yeu thich hay chua
  console.log(id, 12345);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/favourite/isfavourite/${id}`);
      setIsFavourite(res.data.data);
    })();
  }, [id]);

  //them vao danh sach yeu thich
  const addFavourite = async () => {
    await api.post(`/favourite/${id}`);
    setIsFavourite(true);
    alert("da them vao danh sach yeu thich");
  };

  // xoa khoi danh sch yeu thich

  const removeFavourite = async (productId) => {
    console.log(isfavourite, 12345345);

    await api.delete(`/favourite/${productId}`);

    setIsFavourite(false);
    alert("da xoa khoi danh sach yeu thich");
  };

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
  // Tìm variant được chọn
  const selectedVariant = useMemo(() => {
    return colorVariants[selectedColor]?.find(
      (size) => size.size === selectedSize
    );
  }, [selectedColor, selectedSize, colorVariants]);
  const availableStock = selectedVariant ? selectedVariant.quantity : 0;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    const cartItem = {
      kho: availableStock,
      productId: data.product._id,
      title: data.product.title,
      image: data.product.image?.length
        ? data.product.image[0].url
        : "https://via.placeholder.com/300",
      color: selectedColor,
      size: selectedSize,
      price: selectedVariant?.price || data.product.originalPrice,
      quantity: 1,
      brand: data.product.brand,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.productId === cartItem.productId &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    if (existingCart) {
      try {
        const response = await fetch("http://localhost:5000/api/v1/carts/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(cartItem),
        });

        const result = await response.json();

        if (response.ok) {
          message.success("Sản phẩm đã được thêm vào giỏ hàng! 🛒");
          // navigate("/cart");
        } else {
          message.error(`Thêm vào giỏ hàng thất bại: ${result.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        message.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
      }
    } else {
      message.warning("Chưa có giỏ hàng trong localStorage!");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.product) return <div>Product not found</div>;

  const product = data.product;

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
            {selectedSize ? (
              <div className="text-md font-medium text-black/[0.5] mt-2">
                {availableStock > 0
                  ? `Còn lại: ${availableStock} sản phẩm`
                  : "Hết hàng"}
              </div>
            ) : (
              <p></p>
            )}
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
            <div className="text-md font-medium text-black/[0.5] mb-10">
              {`(Bao gồm tất cả các loại thuế và phí áp dụng)`}
            </div>
            {/* số lượng tăng giảm  */}
            {selectedSize ? (
              <div className="flex flex-col mb-4">
                <div className="flex items-center">
                  <span className="mr-3">Số lượng:</span>

                  {/* Nút giảm số lượng */}
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none rounded-l"
                    onClick={() => {
                      decrementQuantity();
                      setQuantityError(""); // Xóa thông báo lỗi khi giảm số lượng
                    }}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>

                  <input
                    type="text"
                    className="w-12 py-1 text-center border-x border-gray-300 focus:outline-none"
                    value={quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cho phép nhập số
                      if (/^[0-9]*$/.test(value)) {
                        const newValue = value === "" ? "" : parseInt(value);
                        if (value === "") {
                          setQuantity("");
                          setQuantityError("");
                        } else if (!isNaN(newValue) && newValue > 0) {
                          if (
                            selectedVariant &&
                            newValue > selectedVariant.quantity
                          ) {
                            setQuantity(selectedVariant.quantity);
                            setQuantityError(
                              `Số lượng tối đa là ${selectedVariant.quantity}`
                            );
                            // Tự động ẩn thông báo lỗi sau 3 giây
                            setTimeout(() => setQuantityError(""), 3000);
                          } else {
                            setQuantity(newValue);
                            setQuantityError("");
                          }
                        }
                      }
                    }}
                    onBlur={() => {
                      if (quantity === "" || quantity < 1) {
                        setQuantity(1);
                        setQuantityError("");
                      }
                    }}
                  />

                  {/* Nút tăng số lượng */}
                  <button
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg font-semibold focus:outline-none rounded-r"
                    onClick={() => {
                      if (
                        selectedVariant &&
                        quantity >= selectedVariant.quantity
                      ) {
                        setQuantityError(
                          `Số lượng tối đa là ${selectedVariant.quantity}`
                        );
                        // Tự động ẩn thông báo lỗi sau 3 giây
                        setTimeout(() => setQuantityError(""), 3000);
                      } else {
                        incrementQuantity();
                        setQuantityError("");
                      }
                    }}
                    disabled={
                      selectedVariant && quantity >= selectedVariant.quantity
                    }
                  >
                    +
                  </button>
                </div>

                {/* Hiển thị thông báo lỗi */}
                {quantityError && (
                  <div className="text-red-500 text-sm mt-1 animate-pulse">
                    {quantityError}
                  </div>
                )}

                {/* Hiển thị thông tin số lượng còn lại */}
                <div className="text-sm text-gray-500 mt-1">
                  {selectedVariant && selectedVariant.quantity > 0
                    ? `Còn lại: ${selectedVariant.quantity} sản phẩm`
                    : "Hết hàng"}
                </div>
              </div>
            ) : null}
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
            {isfavourite ? (
              <button
                onClick={() => removeFavourite(product._id)}
                className="w-full py-4 rounded-full border border-black
             text-lg font-medium transition-transform
             flex items-center justify-center gap-2 hover:opacity-75 mb-10"
              >
                Hủy yêu thích
                <IoMdHeartEmpty size={20} />
              </button>
            ) : (
              <button
                onClick={() => addFavourite()}
                className="w-full py-4 rounded-full border border-black
             text-lg font-medium transition-transform
             flex items-center justify-center gap-2 hover:opacity-75 mb-10"
              >
                Yêu thích
                <IoMdHeartEmpty size={20} />
              </button>
            )}

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
