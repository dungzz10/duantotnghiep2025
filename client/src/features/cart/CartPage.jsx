import React, { useState, useEffect } from "react";
import { Table, Button, InputNumber, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../axios/api";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]);
  const [selectedColor] = useState(null);
  const [productId] = useState(null);
  const [colors, setAvailableColors] = useState([]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/carts/details");
        const rawCart = res.data.cart || [];
        if (rawCart.length === 0) {
          navigate("/cart");
          return;
        }

        const groupedCart = rawCart.reduce((acc, item) => {
          const existingProduct = acc.find(
            (p) => p.productId === item.productId
          );
          if (existingProduct) {
            const existingVariant = existingProduct.variants.find(
              (v) => v.color === item.color && v.size === item.size
            );
            if (existingVariant) {
              existingVariant.quantity += item.quantity;
            } else {
              existingProduct.variants.push({
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                kho: item.kho,
              });
            }

            existingProduct.totalQuantity += item.quantity;
            existingProduct.totalPrice += item.quantity * item.price;
          } else {
            acc.push({
              productId: item.productId,
              title: item.title,
              image: item.image,
              totalQuantity: item.quantity,
              totalPrice: item.quantity * item.price,
              variants: [
                {
                  color: item.color,
                  size: item.size,
                  quantity: item.quantity,
                  price: item.price,
                  kho: item.kho,
                },
              ],
            });
          }
          return acc;
        }, []);

        setCartData(groupedCart);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleFetchColors = async (productId) => {
    try {
      const res = await api.get(`/product/${productId}/colors`);
      setAvailableColors(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách màu sắc:", error);
      message.error("Không thể tải danh sách màu sắc");
    }
  };

  const handleFetchSizes = async (productId, color) => {
    try {
      const res = await api.get(`/product/${productId}/sizes/${color}`);
      setSizes(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kích thước:", error);
    }
  };
  useEffect(() => {
    if (productId) {
      handleFetchColors(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (productId && selectedColor) {
      handleFetchSizes(productId, selectedColor);
    }
  }, [productId, selectedColor]);

  const handleColorChange = async (selectedColor, productId, variant) => {
    try {
      if (!selectedColor) {
        message.warning("Vui lòng chọn màu.");
        return;
      }

      const res = await api.get(`/product/${productId}/sizes/${selectedColor}`);
      const availableSizes = res.data;

      if (availableSizes.length === 0) {
        message.warning("Không có kích thước nào cho màu này.");
        return;
      }
      const availableSizeWithStock = availableSizes.filter(
        (size) => size.quantity > 0
      );
      if (availableSizeWithStock.length === 0) {
        message.warning("Không có kích thước còn hàng cho màu này.");
        return;
      }

      let newDefaultSize = availableSizeWithStock[0].size;
      let newDefaultPrice = availableSizeWithStock[0].price;

      if (availableSizes[0].quantity === 0) {
        newDefaultSize = availableSizeWithStock[1]
          ? availableSizeWithStock[1].size
          : availableSizeWithStock[0].size;
        newDefaultPrice = availableSizeWithStock[1]
          ? availableSizeWithStock[1].price
          : availableSizeWithStock[0].price;
      }

      setCartData((prev) =>
        prev.map((product) => {
          if (product.productId === productId) {
            const updatedVariants = product.variants.map((v) =>
              v.color === variant.color && v.size === variant.size
                ? {
                    ...v,
                    color: selectedColor,
                    size: newDefaultSize,
                    price: newDefaultPrice,
                  }
                : v
            );

            const newTotalPrice = updatedVariants.reduce(
              (sum, currentVariant) =>
                sum + currentVariant.quantity * currentVariant.price,
              0
            );
            const newTotalQuantity = updatedVariants.reduce(
              (sum, currentVariant) => sum + currentVariant.quantity,
              0
            );

            return {
              ...product,
              variants: updatedVariants,
              totalPrice: newTotalPrice,
              totalQuantity: newTotalQuantity,
            };
          }
          return product;
        })
      );

      setSizes(availableSizes);
    } catch (error) {
      console.error("Lỗi khi thay đổi màu sắc:", error);
      message.error("Không thể lấy danh sách kích thước.");
    }
  };

  const handleSizeChange = async (value, productId, selectedColor, variant) => {
    try {
      const res = await api.get(`/product/${productId}/sizes/${selectedColor}`);
      const availableSizes = res.data;

      if (availableSizes.length === 0) {
        message.warning("Không có kích thước nào cho màu này.");
        return;
      }

      const selectedSize = availableSizes.find((s) => s.size === value);

      if (!selectedSize) {
        message.warning("Size không hợp lệ với màu này.");
        return;
      }

      setCartData((prev) =>
        prev.map((product) => {
          if (product.productId === productId) {
            const updatedVariants = product.variants.map((v) => {
              if (v.color === selectedColor && v.size === variant.size) {
                return {
                  ...v,
                  size: selectedSize.size,
                  price: selectedSize.price,
                };
              }
              return v;
            });

            return {
              ...product,
              variants: updatedVariants,
              totalPrice: updatedVariants.reduce(
                (sum, v) => sum + v.quantity * v.price,
                0
              ),
            };
          }
          return product;
        })
      );

      setSizes(availableSizes);
    } catch (error) {
      console.error("Lỗi khi thay đổi size:", error);
      message.error("Không thể thay đổi size sản phẩm");
    }
  };

  const handleQuantityChange = async (value, productId, variant) => {
    if (value < 1) return;

    try {
      setCartData((prev) => {
        return prev.map((product) => {
          if (product.productId === productId) {
            const updatedVariants = product.variants.map((v) =>
              v.color === variant.color && v.size === variant.size
                ? { ...v, quantity: value }
                : v
            );
            const newTotalQuantity = updatedVariants.reduce(
              (sum, v) => sum + v.quantity,
              0
            );

            const newTotalPrice = updatedVariants.reduce(
              (sum, v) =>
                v.color === variant.color && v.size === variant.size
                  ? sum + value * v.price
                  : sum + v.quantity * v.price,
              0
            );

            return {
              ...product,
              variants: updatedVariants,
              totalQuantity: newTotalQuantity,
              totalPrice: newTotalPrice,
            };
          }
          return product;
        });
      });
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      message.error("Không thể cập nhật số lượng sản phẩm");
    }
  };

  const handleDeleteItem = async (productId, variantToDelete) => {
    try {
      const product = cartData.find(
        (product) => product.productId === productId
      );
      const remainingVariants = product.variants.filter(
        (variant) =>
          variant.color !== variantToDelete.color ||
          variant.size !== variantToDelete.size
      );
      if (remainingVariants.length === 0) {
        await axios.post("/carts/delete", {
          items: product.variants.map((variant) => ({
            productId,
            color: variant.color,
            size: variant.size,
          })),
        });

        setCartData((prev) =>
          prev.filter((product) => product.productId !== productId)
        );
      } else {
        await axios.post("/carts/delete", {
          items: [
            {
              productId,
              color: variantToDelete.color,
              size: variantToDelete.size,
            },
          ],
        });

        setCartData((prev) =>
          prev.map((product) =>
            product.productId === productId
              ? {
                  ...product,
                  variants: remainingVariants,
                  totalQuantity: remainingVariants.reduce(
                    (sum, variant) => sum + variant.quantity,
                    0
                  ),
                  totalPrice: remainingVariants.reduce(
                    (sum, variant) => sum + variant.quantity * variant.price,
                    0
                  ),
                }
              : product
          )
        );
      }

      message.success("Sản phẩm hoặc biến thể đã được xóa");
    } catch (error) {
      console.error("Error deleting item:", error);
      message.error("Không thể xóa sản phẩm hoặc biến thể");
    }
  };

  const handleDeleteSelectedItems = async () => {
    try {
      const itemsToDelete = cartData
        .filter((product) =>
          selectedProducts.includes(product.productId.toString())
        )
        .flatMap((product) =>
          product.variants.map((variant) => ({
            productId: product.productId,
            color: variant.color,
            size: variant.size,
          }))
        );

      await axios.post("/carts/delete", { items: itemsToDelete });

      setCartData((prev) =>
        prev.filter(
          (product) => !selectedProducts.includes(product.productId.toString())
        )
      );

      setSelectedProducts([]);
      message.success("Các sản phẩm đã được xóa");
    } catch (error) {
      console.error("Error deleting selected items:", error);
      message.error("Không thể xóa các sản phẩm đã chọn");
    }
  };

  const handleCheckout = async () => {
    const selectedItems = cartData
      .filter((product) =>
        selectedProducts.includes(product.productId.toString())
      )
      .flatMap((product) =>
        product.variants.map((variant) => ({
          productId: product.productId,
          title: product.title,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
          price: variant.price,
          image: product.image,
          kho: variant.kho,
        }))
      );

    if (!selectedItems.length) {
      message.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    const invalidItems = selectedItems.filter(
      (item) => item.quantity > item.kho
    );

    if (invalidItems.length > 0) {
      const errorMessage = invalidItems
        .map(
          (item) =>
            `Sản phẩm: ${item.title}, Màu: ${item.color}, Size: ${item.size} chỉ còn ${item.kho} sản phẩm`
        )
        .join("\n");
      message.error(`Số lượng vượt quá tồn kho:\n${errorMessage}`);
      return;
    }

    const total = selectedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const checkoutData = {
      products: selectedItems,
      total,
      shippingFee: 30000,
      voucherDiscount: 0,
    };

    localStorage.setItem("order", JSON.stringify(checkoutData));

    message.success("Chọn phương thức thanh toán");
    console.log("order:", checkoutData);

    navigate("/cart/checkout");
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={record.image}
            alt={record.title}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/products/${record.productId}`)}
          />
          <div
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/products/${record.productId}`)}
          >
            {record.title}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng số lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      render: (quantity) => quantity,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => `${totalPrice.toLocaleString()} VNĐ`,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => handleDeleteItem(record.productId, record.variants[0])}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px" }}
        className="text-2xl font-semibold text-gray-800"
      >
        Giỏ Hàng
      </h1>
      <Table
        columns={columns}
        dataSource={cartData}
        rowKey={(record) => record.productId}
        pagination={false}
        locale={{ emptyText: "Không có sản phẩm nào trong giỏ hàng" }}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              {record.variants.map((variant, index) => (
                <div
                  key={`${record.productId}-${variant.color}-${variant.size}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      index !== record.variants.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      marginLeft: "40px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      maxWidth: 280,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Dropdown chọn màu */}
                    <Select
                      placeholder="Chọn màu"
                      style={{ width: 120, marginRight: 10 }}
                      value={variant.selectedColor || variant.color}
                      onChange={(value) =>
                        handleColorChange(value, record.productId, variant)
                      }
                      onFocus={() => handleFetchColors(record.productId)}
                    >
                      {colors.map((color) => (
                        <Select.Option key={color} value={color}>
                          {color}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* Dropdown chọn kích thước */}
                    <Select
                      placeholder="Chọn size"
                      style={{ width: 120 }}
                      value={variant.size}
                      onChange={(value) =>
                        handleSizeChange(
                          value,
                          record.productId,
                          variant.color,
                          variant
                        )
                      }
                      onFocus={() =>
                        handleFetchSizes(record.productId, variant.color)
                      }
                      // disabled={!variant.selectedColor}
                    >
                      {sizes
                        .filter((sizeObj) => sizeObj.quantity > 0)
                        .map((sizeObj) => (
                          <Select.Option
                            key={sizeObj.size}
                            value={sizeObj.size}
                          >
                            {sizeObj.size}{" "}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div style={{ textAlign: "center", maxWidth: 100,
                      flexWrap: "wrap", marginLeft: 65 }}>
                    <InputNumber
                      min={1}
                      value={variant.quantity}
                      onChange={(value) =>
                        handleQuantityChange(value, record.productId, variant)
                      }
                    />
                  </div>
                  <div style={{ textAlign: "center",maxWidth: 120,
                      flexWrap: "wrap", marginLeft: 105 }}>
                    {variant.price.toLocaleString()} VNĐ
                  </div>
                  <div style={{ textAlign: "center",maxWidth: 50,
                      flexWrap: "wrap", marginLeft: 133 }}>
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() =>
                        handleDeleteItem(record.productId, variant)
                      }
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ),
        }}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys) =>
            setSelectedProducts(selectedRowKeys.map(String)),
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          type="primary"
          danger
          onClick={handleDeleteSelectedItems}
          disabled={!selectedProducts.length}
        >
          Xóa sản phẩm đã chọn
        </Button>
        <div>
          <span style={{ marginRight: "20px" }}>
            Tổng thanh toán:{" "}
            <strong>
              {cartData
                .filter((product) =>
                  selectedProducts.includes(product.productId.toString())
                )
                .reduce(
                  (sum, product) =>
                    sum +
                    product.variants.reduce((subSum, variant) => {
                      return subSum + variant.quantity * variant.price;
                    }, 0),
                  0
                )
                .toLocaleString()}{" "}
              VNĐ
            </strong>
          </span>
          <Button
            type="primary"
            onClick={handleCheckout}
            disabled={!selectedProducts.length}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
