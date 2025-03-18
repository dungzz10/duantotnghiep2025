import User from "../models/usersModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { kho, productId, color, size, quantity, title, image, price, brand ="" } =
      req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    user.cart = user.cart || [];
    const existingItemIndex = user.cart.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.color === color &&
        item.size === size
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
        size,
        price,
        quantity,
        brand,
      });
    }
    await user.save();
    console.log(user.cart);
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