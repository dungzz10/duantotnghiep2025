import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, message, InputNumber } from "antd";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/carts/details");
        const rawCart = res.data.cart || [];

        if (rawCart.length === 0) {
          navigate("/cart/emptycart");
          return;
        }
        const mergedCartMap = new Map();

        rawCart.forEach((item) => {
          const key = `${item.productId}-${item.color}-${item.size}-${item.kho}`;
          if (!mergedCartMap.has(key)) {
            mergedCartMap.set(key, { ...item });
          } else {
            const existing = mergedCartMap.get(key);
            existing.quantity += item.quantity;
          }
        });
        // console.log("Giỏ hàng:", Array.from(mergedCartMap.values()));
        setCartData(Array.from(mergedCartMap.values()));
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [navigate]);
  const getItemKey = (item) => `${item.productId}-${item.color}-${item.size}`;
  const handleSelectAll = () => {
    const allKeys = cartData.map(getItemKey);
    setSelectedProducts(selectAll ? [] : allKeys);
    setSelectAll(!selectAll);
  };

  const handleSelect = (item) => {
    const key = getItemKey(item);
    setSelectedProducts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleQuantityChange = (value, product) => {
    if (value < 1) return;

    const currentItem = cartData.find(
      (item) =>
        item.productId === product.productId &&
        item.color === product.color &&
        item.size === product.size
    );

    if (!currentItem) {
      console.error("Không tìm thấy sản phẩm trong giỏ hàng");
      return;
    }

    setCartData((prev) =>
      prev.map((item) =>
        item.productId === product.productId &&
        item.color === product.color &&
        item.size === product.size
          ? { ...item, quantity: value }
          : item
      )
    );
  };

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const handleDeleteItem = async (productId, color, size) => {
    const itemKey = `${productId}-${color}-${size}`;
    if (!selectedProducts.includes(itemKey)) {
      message.warning("Vui lòng chọn sản phẩm trước khi xoá");
      return;
    }

    try {
      await axios.post("/carts/delete", {
        items: [{ productId, color, size }],
      });

      setCartData((prev) =>
        prev.filter(
          (item) =>
            !(
              item.productId === productId &&
              item.color === color &&
              item.size === size
            )
        )
      );

      message.success("Đã xoá sản phẩm");
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm", error);
      message.error("Không thể xoá sản phẩm");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để xoá");
      return;
    }
    try {
      const selectedItems = cartData.filter((item) =>
        selectedProducts.includes(getItemKey(item))
      );

      const toDelete = selectedItems.map((item) => ({
        productId: item.productId,
        color: item.color,
        size: item.size,
      }));

      await axios.post("/carts/delete", {
        items: toDelete,
      });

      setCartData((prev) =>
        prev.filter(
          (item) =>
            !toDelete.some(
              (d) =>
                d.productId === item.productId &&
                d.color === item.color &&
                d.size === item.size
            )
        )
      );
      setSelectedProducts([]);
      setSelectAll(false);
      message.success("Đã xoá sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.error("Xoá sản phẩm thất bại", error);
      message.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng");
    }
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const errors = [];

    if (!user) {
      message.error("Cần đăng nhập");
      return;
    }

    const selectedItems = cartData.filter((item) =>
      selectedProducts.includes(getItemKey(item))
    );

    if (!selectedItems.length) {
      message.error("Giỏ hàng trống!");
      return;
    }

    selectedItems.forEach((item) => {
      if (item.quantity > item.kho) {
        errors.push(
          `Sản phẩm "${item.name}" (${item.color}, size ${item.size}) chỉ còn ${item.kho} sản phẩm`
        );
      }
    });

    if (errors.length > 0) {
      errors.forEach((err) => message.error(err));
      return;
    }

    try {
      // console.log("Đủ tồn kho, tiếp tục xử lý...");
    } catch {
      message.error("Đã xảy ra lỗi khi xử lý đơn hàng");
    }

    const total = selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const orderData = {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
        shippingAddress:
        user.address?.[0] || { address: "Chưa có địa chỉ", addressType: "" },
    },
      products: selectedItems.map((item) => ({
        productId: item.productId || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image,
        khoConLai: item.kho - item.quantity,
      })),
      total,
      createdAt: new Date().toISOString(),
    };
    console.log("Dữ liệu đơn hàng:", orderData);

    localStorage.setItem("order", JSON.stringify(orderData));
    navigate("/cart/checkout");
  };

  return (
    <div className="w-full bg-[#f5f5f5] py-6">
      <div className="w-full px-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black-500 uppercase tracking-wide">
          Giỏ Hàng
        </h1>
        <div className="grid grid-cols-12 font-semibold text-sm bg-white border-b py-3 px-4 rounded-t-md">
          <div className="col-span-5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
          </div>
          <div className="col-span-2 text-center">Đơn Giá</div>
          <div className="col-span-2 text-center">Số Lượng</div>
          <div className="col-span-2 text-center">Tổng Tiền</div>
          <div className="col-span-1 text-center">Thao Tác</div>
        </div>

        <div className="bg-white rounded-b-md">
          {Object.entries(
            cartData.reduce((acc, item) => {
              if (!acc[item.productId]) {
                acc[item.productId] = {
                  ...item,
                  variants: [],
                };
              }
              acc[item.productId].variants.push(item);
              return acc;
            }, {})
          ).map(([productId, group]) => (
            <div key={productId}>
              {/* Dòng chính */}
              <div className="grid grid-cols-12 items-center border-t px-4 py-4 hover:bg-[#fafafa] bg-white">
                <div className="col-span-5 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={group.variants.every((v) =>
                      selectedProducts.includes(getItemKey(v))
                    )}
                    onChange={() => {
                      const keys = group.variants.map(getItemKey);
                      const isSelected = keys.every((k) =>
                        selectedProducts.includes(k)
                      );
                      setSelectedProducts((prev) =>
                        isSelected
                          ? prev.filter((k) => !keys.includes(k))
                          : [...prev, ...keys]
                      );
                    }}
                  />
                  <img
                    src={group.image}
                    alt={group.title}
                    onClick={() => toggleExpand(productId)}
                    className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform"
                  />
                  <div>
                    <h2
                      onClick={() => navigate(`/products/${productId}`)}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {group.title}
                    </h2>
                    <div className="text-xs text-gray-500">
                      {group.variants.length} phân loại
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-center text-sm text-gray-800">
                  {group.variants[0].price.toLocaleString()} VNĐ
                </div>
                <div className="col-span-2 text-center text-sm">
                  {group.variants[0].quantity}
                </div>
                <div className="col-span-2 text-center text-sm text-red-500 font-semibold">
                  {group.variants
                    .reduce((sum, v) => sum + v.price * v.quantity, 0)
                    .toLocaleString()}{" "}
                  VNĐ
                </div>
                <div className="col-span-1 text-center">
                  {group.variants.length === 1 &&
                    selectedProducts.includes(
                      getItemKey(group.variants[0])
                    ) && (
                      <button
                        onClick={() =>
                          handleDeleteItem(
                            group.variants[0].productId,
                            group.variants[0].color,
                            group.variants[0].size
                          )
                        }
                        className="text-red-500 text-xs hover:underline"
                      >
                        Xoá
                      </button>
                    )}
                </div>
              </div>

              {/* Dòng biến thể */}
              {expandedProduct === productId &&
                group.variants.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 items-center border-t px-10 py-2 bg-[#fcfcfc] text-sm"
                  >
                    <div className="col-span-5 flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(getItemKey(item))}
                        onChange={() => handleSelect(item)}
                      />
                      <div className="text-sm text-gray-700">
                        Màu: {item.color} / Cỡ: {item.size}
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-gray-800">
                      {item.price.toLocaleString()} VNĐ
                    </div>
                    <div className="col-span-2 text-center">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.quantity - 1, item)
                        }
                      >
                        -
                      </button>
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(value, item)}
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(item.quantity + 1, item)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="col-span-2 text-center text-red-500 font-semibold">
                      {(item.price * item.quantity).toLocaleString()} VNĐ
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() =>
                          handleDeleteItem(
                            item.productId,
                            item.color,
                            item.size
                          )
                        }
                        className="text-red-400 text-xs hover:underline"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#e0e0e0] p-4 rounded-md flex items-center gap-2 mb-4 relative group">
          <span className="text-green-600">🚚</span>
          <span className="text-sm text-gray-700">
            Giảm <span className="font-semibold text-black">50.000VNĐ</span> phí
            vận chuyển đơn tối thiểu{" "}
            <span className="font-semibold text-black">0đ</span>
            &nbsp;
            <span className="text-blue-500 text-sm cursor-pointer relative group">
              Tìm hiểu thêm
              <div className="absolute top-6 left-0 w-64 bg-white border border-gray-300 shadow-lg p-4 rounded-md text-sm z-50 hidden group-hover:block">
                <p className="font-medium text-black mb-2">
                  Khuyến mãi vận chuyển:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Vận chuyển tiết kiệm</li>
                  <li>Vận chuyển nhanh</li>
                  <li>Hỏa tốc</li>
                </ul>
              </div>
            </span>
          </span>
        </div>

        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <span className="text-sm text-gray-800">Chọn tất cả</span>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedProducts.length === 0}
              className="text-red-500 text-sm hover:underline"
            >
              Xóa sản phẩm đã chọn
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-700">
              Tổng thanh toán:&nbsp;
              <span className="text-lg text-red-500 font-semibold">
                {cartData
                  .filter((item) => selectedProducts.includes(getItemKey(item)))
                  .reduce((sum, item) => sum + item.quantity * item.price, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleCheckout}
              disabled={!selectedProducts.length}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6"
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
