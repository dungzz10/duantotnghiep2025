import User from "../models/usersModel.js";
import Product from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, color, size, quantity, title, image, price, brand } =
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
    const user = await User.findById(req.user.id).lean();

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(200).json({ cart: [] });
    }

    const productIds = user.cart.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: productIds } }).lean();

    const cartDetails = user.cart
      .map((item) => {
        const product = products.find(
          (p) => String(p._id) === String(item.productId)
        );
        if (!product) {
          console.log("Không tìm thấy sản phẩm:", item.productId);
          return null;
        }

        const variant = product.variants.find((v) => v.color === item.color);
        if (!variant) {
          console.log(
            "Không tìm thấy màu:",
            item.color,
            "trong sản phẩm:",
            product.title
          );
          return null;
        }

        const sizeObj = variant.sizes.find(
          (s) => String(s.size) === String(item.size)
        );
        if (!sizeObj) {
          console.log(
            "Không tìm thấy size:",
            item.size,
            "trong màu:",
            variant.color
          );
          return null;
        }

        return {
          productId: product._id,
          title: product.title,
          brand: product.brand,
          image: product.image?.[0]?.url || item.image,
          color: variant.color,
          size: sizeObj.size,
          quantity: item.quantity,
          price: sizeObj.price,
          total: item.quantity * sizeObj.price,
        };
      })
      .filter(Boolean);

    res.status(200).json({ cart: cartDetails });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết giỏ hàng:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
