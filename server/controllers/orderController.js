import Order from "../models/orderModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import User from "../models/usersModel.js"

const validStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const getNewOrders = CatchAsync(async (req, res, next) => {
  try {
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    const orders = await Order.find({
      $or: [
        { orderStatus: "pending", date: { $gte: threeMinutesAgo } },
        { orderStatus: "processing", date: { $gte: threeMinutesAgo } },
      ],
    })
      .sort({ date: -1 })
      .limit(7)
      .select("_id orderStatus userId date")
      .populate("userId", "name")
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không có đơn hàng mới trong 3 phút gần đây.",
      });
    }

    res.status(200).json({ success: true, newOrders: orders });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng mới:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy đơn hàng mới." });
  }
});

// Kiểm tra xem người dùng có đơn hàng đã giao với sản phẩm này chưa
export const checkDeliveredOrder = async (req, res) => {
  const { userId, productId } = req.query;

  if (!productId || !userId) {
    return res.status(400).json({ message: "Thiếu productId hoặc userId" });
  }

  try {
    // Kiểm tra đơn hàng có sản phẩm và đã giao chưa
    const order = await Order.findOne({
      userId: userId,
      "products.productId": productId, // Kiểm tra trong mảng products
      orderStatus: "delivered",
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Đơn hàng chưa được giao hoặc không tồn tại" });
    }

    return res.status(200).json({ message: "Đơn hàng đã được giao" });
  } catch (error) {
    console.error("Lỗi kiểm tra đơn hàng đã giao:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAllOrders = CatchAsync(async (req, res, next) => {
  const { id: userId, role } = req.user;

  if (!userId) {
    return next(new HandelError("Người dùng chưa đăng nhập", 401));
  }
  let filter = { userId };

  if (
    (role === "admin" || role === "superadmin") &&
    req.query.adminView === "true"
  ) {
    filter = {};
  }

  const orders = await Order.find(filter)
    .populate({
      path: "userId",
      select: "-password -passwordResetToken -passwordResetExpires",
    })
    .populate({
      path: "products.productId",
      select: "-__v -isDeleted",
    })
    .lean();

  if (!orders || orders.length === 0) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }
  orders.sort((a, b) => {
    if (
      (a.orderStatus === "pending" && b.orderStatus === "pending") ||
      (a.orderStatus === "processing" && b.orderStatus === "processing") ||
      (a.orderStatus === "shipped" && b.orderStatus === "shipped") ||
      (a.orderStatus === "delivered" && b.orderStatus === "delivered") ||
      (a.orderStatus === "cancelled" && b.orderStatus === "cancelled")
    ) {
      return new Date(b.date) - new Date(a.date);
    }
    return (
      validStatuses.indexOf(a.orderStatus) -
      validStatuses.indexOf(b.orderStatus)
    );
  });

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
      path: "userId",
      select: "-password -passwordResetToken -passwordResetExpires",
    })
    .populate({
      path: "products.productId",
      select: "-__v -isDeleted",
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
    total,
    shippingAddress,
    shippingFee,
    voucherDiscount = 0,
    amount,
  } = req.body;
  const finalTotal = total + shippingFee - voucherDiscount;

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
  const generateOrderId = () =>
    `${Math.random().toString(36).toUpperCase().slice(2, 6)}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

  const orderId = generateOrderId();

  const newOrder = await Order.create({
    userId,
    orderId,
    amount,
    total,
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

  if (!validStatuses.includes(orderStatus)) {
    return next(new HandelError("Trạng thái đơn hàng không hợp lệ", 400));
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  const currentStatusIndex = validStatuses.indexOf(order.orderStatus);
  const newStatusIndex = validStatuses.indexOf(orderStatus);

  if (currentStatusIndex === -1 || newStatusIndex === -1) {
    return next(new HandelError("Trạng thái đơn hàng không hợp lệ", 400));
  }

  if (newStatusIndex < currentStatusIndex) {
    return next(
      new HandelError("Không thể cập nhật trạng thái ngược lại", 400)
    );
  }

  if (order.orderStatus === "shipped" && orderStatus === "cancelled") {
    return next(new HandelError("Đơn hàng đang giao không thể huỷ", 400));
  }


  if (order.orderStatus === "cancelled") {
    return next(
      new HandelError("Đơn hàng đã bị hủy và không thể cập nhật", 400)
    );
  }

  if (
    order.orderStatus === "delivered" &&
    !["returned", "refunded"].includes(orderStatus)
  ) {
    return next(
      new HandelError(
        "Đơn hàng đã giao, chỉ có thể cập nhật thành trạng thái hoàn tiền",
        400
      )
    );
  }

  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Đơn hàng đã được cập nhật thành công",
    order,
  });
});
export const updateKho = CatchAsync(async (req, res, next) => {
  const { products } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Người dùng chưa xác thực.",
    });
  }

  try {
    for (const product of products) {
      const { productId, color, size, quantity } = product;

      const productDoc = await Product.findById(productId);
      if (!productDoc) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy sản phẩm với ID: ${productId}`,
        });
      }

      const variant = productDoc.variants.find(
        (v) => v.color.toLowerCase() === color.toLowerCase()
      );
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy biến thể với màu: ${color} cho sản phẩm ${productId}`,
        });
      }

      const sizeObj = variant.sizes.find(
        (s) => String(s.size) === String(size)
      );
      if (!sizeObj) {
        return res.status(404).json({
          success: false,
          message: `Không tìm thấy kích thước: ${size} cho sản phẩm ${productId} với màu ${color}`,
        });
      }
      if (sizeObj.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Số lượng tồn kho không đủ cho sản phẩm ${productId} với màu ${color} và kích thước ${size}`,
        });
      }

      sizeObj.quantity -= quantity;

      await productDoc.save();
    }

    return res.status(200).json({
      success: true,
      message: "Tồn kho đã được cập nhật thành công.",
    });
  } catch (error) {
    console.error("Lỗi cập nhật tồn kho:", error);
    return res.status(500).json({
      success: false,
      message: `Lỗi cập nhật tồn kho: ${error.message}`,
    });
  }
});

export const deleteOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;
 

  console.log(orderId, 8888);

  const order = await Order.findById(orderId);
  console.log(order, 77777);

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
    return res.json({
      message: "Không thể hủy đơn hàng",
    });
  }

  if (order.paymentMethod !== "COD" && order.paymentStatus === "pending") {
    return res.json({
      message: "Không thể hủy đơn hàng do đang trong quá trình thanh toán",
    });
  }

  if (order.paymentMethod === "COD" || order.paymentStatus === "failed") {
    order.orderStatus = "cancelled";

    for (const item of order.products) {
      const productDoc = await Product.findById(item.productId);
      if (productDoc) {
        const variant = productDoc.variants.find(
          (v) => v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (variant) {
          const sizeObj = variant.sizes.find(
            (s) => String(s.size) === String(item.size)
          );

          if (sizeObj) {
            sizeObj.quantity += item.quantity;
            await productDoc.save();
          }
        }
      }
    }

    await order.save();

    // Cập nhật trực tiếp số dư ví người dùng
    await User.updateOne(
      { _id: order.userId },
      { $inc: { "wallet.balance": order.finalTotal } } // Cộng tiền vào ví
    );

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được hủy thành công, và tiền đã được hoàn vào ví",
      order,
    });
  } else if (order.paymentMethod !== "COD" || order.paymentStatus === "completed") {
    order.orderStatus = "cancelled";

    for (const item of order.products) {
      const productDoc = await Product.findById(item.productId);
      if (productDoc) {
        const variant = productDoc.variants.find(
          (v) => v.color.toLowerCase() === item.color.toLowerCase()
        );

        if (variant) {
          const sizeObj = variant.sizes.find(
            (s) => String(s.size) === String(item.size)
          );

          if (sizeObj) {
            sizeObj.quantity += item.quantity;
            await productDoc.save();
          }
        }
      }
    }

    await order.save();

    // Cập nhật trực tiếp số dư ví người dùng
    await User.updateOne(
      { _id: order.userId },
      { $inc: { "wallet.balance": order.finalTotal } } // Cộng tiền vào ví
    );

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được hủy thành công, và tiền đã được hoàn vào ví",
      order,
    });
  }

  res.status(200).json({
    success: true,
    message: "Đơn hàng đã được hủy thành công",
    order,
  });
});
