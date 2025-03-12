import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedProductIds, setExpandedProductIds] = useState([]);
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
        const grouped = {};
        rawCart.forEach(item => {
          const key = item.productId._id; 
          if (!grouped[key]) {
            grouped[key] = {
              productId: key,
              productName: item.productId.name,
              brand: item.productId.brand,
              image: item.productId.image,
              variants: [],
            };
          }

          const sameVariant = grouped[key].variants.find(v =>
            v.color === item.color && v.size === item.size
          );

          if (sameVariant) {
            sameVariant.quantity += item.quantity;
          } else {
            grouped[key].variants.push({
              color: item.color,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
            });
          }
        });

        setCartData(Object.values(grouped));
        setSelectedProducts([]);
        setSelectAll(false);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [navigate]);

  const toggleExpand = (productId) => {
    setExpandedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const allIds = cartData.map(item => item.productId);
    setSelectedProducts(selectAll ? [] : allIds);
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const getTotalPrice = (variants) =>
    variants.reduce((total, v) => total + v.quantity * v.price, 0);

  const handleDeleteSelected = async () => {
    try {
      await axios.post("/api/v1/orders/delete-multiple", {
        productIds: selectedProducts,
      });
      setCartData(prev => prev.filter(p => !selectedProducts.includes(p.productId)));
      setSelectedProducts([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Xoá sản phẩm thất bại", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6"> Giỏ hàng của bạn</h1>

      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Chọn tất cả
        </label>
        {selectedProducts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Xoá sản phẩm đã chọn
          </button>
        )}
      </div>

       {cartData.map(product => (
        <div
          key={product.productId}
          className="border rounded-xl shadow-sm mb-4 p-4 bg-white"
        >
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.productId)}
              onChange={() => handleSelect(product.productId)}
            />
            <img
              src={product.image}
              alt={product.productName}
              className="w-20 h-20 rounded-xl object-cover cursor-pointer"
              onClick={() => toggleExpand(product.productId)}
            />
            <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(product.productId)}>
              <h2 className="text-lg font-semibold">{product.productName}</h2>
              <p className="text-gray-500">{product.brand}</p>
              <p className="text-sm text-gray-700">
                {product.variants.length} biến thể - Tổng tiền:{" "}
                <span className="font-semibold text-green-600">
                  {getTotalPrice(product.variants).toLocaleString()}₫
                </span>
              </p>
            </div>
          </div>

          {/* Biến thể */}
          {expandedProductIds.includes(product.productId) && (
            <div className="mt-4 border-t pt-3 space-y-2">
              {product.variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm mr-2">Màu:</label>
                      <select className="border rounded p-1" defaultValue={v.color}>
                        <option>{v.color}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm mr-2">Size:</label>
                      <select className="border rounded p-1" defaultValue={v.size}>
                        <option>{v.size}</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-sm">
                    SL: {v.quantity} × {v.price.toLocaleString()}₫ ={" "}
                    <span className="font-medium text-blue-600">
                      {(v.quantity * v.price).toLocaleString()}₫
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartPage;