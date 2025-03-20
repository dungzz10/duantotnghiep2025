import User from "../models/usersModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose"; 

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      kho,
      productId,
      color,
      size,
      quantity,
      title,
      image,
      price,
      brand = "",
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const variants = product.variants.map((variant) => ({
      color: variant.color,
      sizes: variant.sizes.map((size) => ({
        size: size.size,
        quantity: size.quantity,
        price: size.price,
      })),
    }));

    user.cart = user.cart || [];
    const existingItemIndex = user.cart.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === Number(size)
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({
        kho,
        productId,
        title,
        image,
        color,
        size: Number(size),
        price,
        quantity,
        brand,
        variants,
      });
    }
    await user.save();
    res.status(200).json({ message: "Đã thêm vào giỏ hàng", cart: user.cart });
  } catch (error) {
    console.error("Lỗi addToCart:", error);
    res.status(500).json({ message: "Lỗi server khi thêm vào giỏ hàng" });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({ cart: [] });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Lỗi getCartDetails:", error);
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng" });
  }
};
// Cập nhật số lượng sản phẩm trong giỏ hàng(cập nhật cả bên cart trong model user để lấy được số lượng đồng bộ với sản phẩm và giỏ hàng)
export const update = async (req, res) => {
  const userId = req.user._id; 
  const { productId, color, size, quantity } = req.body;  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    if (quantity > product.kho) {
      return res.status(400).json({
        message: `Số lượng yêu cầu (${quantity}) vượt quá số lượng trong kho (${product.kho})`,
      });
    }

    const objectIdProductId = new mongoose.Types.ObjectId(productId);

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "cart.productId": objectIdProductId,
        "cart.color": color,
        "cart.size": size,
      },
      { $set: { "cart.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });
    }

    return res.status(200).json({
      message: "Cập nhật thành công",
      cart: updatedUser.cart,
    });
  } catch (err) {
    console.error("Lỗi server khi cập nhật giỏ hàng:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm nào để xoá" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Xoá từng sản phẩm khỏi cart (so sánh cả productId, color, size)
    user.cart = user.cart.filter((item) => {
      return !items.some(
        (toDelete) =>
          item.productId.toString() === toDelete.productId &&
          item.color === toDelete.color &&
          item.size === toDelete.size
      );
    });

    await user.save();

    res.status(200).json({
      message: "Đã xoá sản phẩm khỏi giỏ hàng",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Lỗi deleteFromCart:", error);
    res.status(500).json({ message: "Lỗi server khi xoá sản phẩm khỏi giỏ hàng" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderProducts } = req.body;

    if (!Array.isArray(orderProducts) || orderProducts.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm nào để xoá" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.cart = user.cart.filter((item) => {
      return !orderProducts.some(
        (ordered) =>
          item.productId.toString() === ordered.productId &&
          item.color === ordered.color &&
          item.size === ordered.size
      );
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Đã xoá sản phẩm sau khi đặt hàng",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Lỗi clearCartAfterOrder:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi xoá giỏ hàng" });
  }
};
