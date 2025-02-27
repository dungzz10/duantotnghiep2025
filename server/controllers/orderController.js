import Order from "../models/orderModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";


export const getAllOrders = CatchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id }) 
    .populate("products.productId", "name price") 
    .lean();

  if (!orders || orders.length === 0) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({ success: true, orders });
});

export const getOrderById = CatchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.orderId }) 
    .populate("products.productId", "name price") 
    .lean();

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({ success: true, order });
});


export const createOrder = CatchAsync(async (req, res, next) => {
  const { products, amount, paymentMethod } = req.body;  // Lấy thông tin từ body request


  if (!products || products.length === 0) {
    return next(new HandelError("Không có sản phẩm trong đơn hàng", 400));
  }

  if (!amount || !paymentMethod) {
    return next(new HandelError("Thông tin thanh toán không đầy đủ", 400));
  }


  const newOrder = await Order.create({
    userId: req.user._id,  
    orderId: `ORD-${Date.now()}`, 
    products: products.map(product => ({
      productId: product.productId, 
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    })),
    amount,
    paymentMethod,
    status: "pending", 
  });

  res.status(201).json({
    success: true,
    message: "Đơn hàng được tạo thành công",
    order: newOrder, 
  });
});
