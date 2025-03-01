import Order from "../models/orderModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";
import mongoose from "mongoose";

export const getAllOrders = CatchAsync(async (req, res, next) => {
  const { id: userId, role } = req.user;
  console.log("id", userId);

  if (!userId) {
    return next(new HandelError("Người dùng chưa đăng nhập", 401));
  }

  const filter = role === "admin" || role === "superadmin" ? {} : { userId };

  const orders = await Order.find(filter)
    .populate("userId", "name")
    .populate({
      path: "products.productId",
      select: "name price image",
    })
    .lean();

  if (!orders || orders.length === 0) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({ success: true, orders });
});

export const getOrderById = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return next(
      new HandelError(`Tham số không hợp lệ: orderId = ${orderId}`, 400)
    );
  }

  const order = await Order.findById(orderId)
    .populate({
      path: "products.productId",
      select: "name price image",
    })
    .lean();

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({ success: true, order });
});

export const createCODOrder = CatchAsync(async (req, res, next) => {
  console.log("Nhận yêu cầu thanh toán COD:", req.body);

  const {
    products,
    amount,
    shippingAddress,
    shippingFee = 0,
    voucherDiscount = 0,
  } = req.body;
  const finalTotal = amount + shippingFee - voucherDiscount;
  if (!amount || isNaN(amount) || finalTotal < 1000) {
    return next(new HandelError("Số tiền không hợp lệ", 400));
  }
  const userId = req.user?.id;
  if (!userId) {
    return next(new HandelError("Người dùng chưa xác thực", 401));
  }
  if (!Array.isArray(products) || products.length === 0) {
    return next(new HandelError("Danh sách sản phẩm không hợp lệ", 400));
  }

  for (const product of products) {
    if (!product.productId) {
      return next(new HandelError("Mỗi sản phẩm phải có productId", 400));
    }
  }

  const orderId = `ORD-${Date.now()}`;

  const newOrder = await Order.create({
    userId,
    orderId,
    amount,
    products,
    shippingAddress,
    shippingFee,
    voucherDiscount,
    finalTotal,
    paymentMethod: "COD",
    paymentStatus: "pending",
    orderStatus: "pending",
    date: new Date(),
  });

  console.log("Đơn hàng COD đã được lưu vào DB:", newOrder);

  res.status(201).json({
    success: true,
    message: "Đơn hàng COD đã được tạo thành công",
    order: newOrder,
  });
});

export const updateOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return next(new HandelError("Trạng thái đơn hàng không hợp lệ", 400));
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({
    success: true,
    message: "Đơn hàng đã được cập nhật thành công",
    order,
  });
});

export const deleteOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOneAndDelete({ orderId });

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({
    success: true,
    message: "Đơn hàng đã được xoá thành công",
  });
});
