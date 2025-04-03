import Order from "../models/orderModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import User from "../models/usersModel.js";

const validStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "trahang",
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
  console.log(orderId, orderStatus, "orderId and orderStatus received");

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

  await User.updateOne(
    { _id: order.userId },
    { $inc: { "wallet.balance": order.finalTotal } }
  );

  return res.status(200).json({
    success: true,
    message: "Đơn hàng đã được hủy thành công, và tiền đã được hoàn vào ví",
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

  console.log(orderId, "orderId received"); // Đảm bảo orderId nhận đúng từ client

  const order = await Order.findById(orderId);
  console.log(order, "order123456");

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  console.log(order, "order123456"); // Đảm bảo đơn hàng tồn tại và được lấy chính xác

  if (order.orderStatus !== "pending" && order.orderStatus !== "processing") {
    return res.json({
      message: "Không thể hủy đơn hàng do đang trong quá trình giao hàng",
    });
  }

  if (order.paymentMethod !== "COD" && order.paymentStatus === "pending") {
    return res.json({
      message: "Không thể hủy đơn hàng do đang trong quá trình thanh toán",
    });
  }

  if (
    ["WALLET", "ATM_MOMO", "MoMo", "COD"].includes(order.paymentMethod) ||
    order.paymentStatus === "failed"
  ) {
    order.orderStatus = "cancelled";

    // Cập nhật lại số lượng sản phẩm trong kho
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
    await User.updateOne(
      { _id: order.userId },
      { $inc: { "wallet.balance": order.finalTotal } }
    );
    const user = await User.findById(order.userId);

    console.log(user, "user123456");

    user.wallet.transactions.push({
      type: "withdrawal",
      amount: order.finalTotal - order.shippingFee,
      status: "completed",
      description: `Hoàn tiền cho đơn hàng ${orderId}`,
    });
    console.log(user.wallet.transactions, "user23456");
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được hủy thành công",
      order,
    });
  } else if (
    order.paymentMethod !== "COD" ||
    order.paymentStatus === "completed"
  ) {
    order.orderStatus = "cancelled";

    // Cập nhật lại số lượng sản phẩm trong kho
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

    console.log(order, "order123456 after updating");

    await order.save();

    await User.updateOne(
      { _id: order.userId },
      { $inc: { "wallet.balance": order.finalTotal } }
    );
    // Lưu lại lịch sử giao dịch trong ví

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

export const getByrecipientPhone = async (req, res) => {
  const { recipientPhone } = req.params;
  console.log(recipientPhone, 5656);

  try {
    const orders = await Order.find({
      "shippingAddress.recipientPhone": recipientPhone,
    })
      .populate({
        path: "userId",
        select: "-password -passwordResetToken -passwordResetExpires",
      })
      .populate({
        path: "products.productId",
        select: "-__v -isDeleted",
      })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy đơn hàng.",
    });
  }
};

export const getByUserPhone = async (req, res, next) => {
  const { phoneNumber } = req.params;
  console.log(phoneNumber, 76767);

  try {
    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return next(new Error("SO_DIEN_THOAI_CHUA_DUOC_DANG_KI"));
    }

    const orders = await Order.find({
      userId: user.id,
    })
      .populate({
        path: "userId",
        select: "-password -passwordResetToken -passwordResetExpires",
      })
      .populate({
        path: "products.productId",
        select: "-__v -isDeleted",
      })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy đơn hàng.",
    });
  }
};
export const returnOrder = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user?.id;

  console.log(orderId, "orderId received"); 

  if (!userId) {
    return next(new HandelError("Người dùng chưa xác thực", 401));
  }

  const order = await Order.findById(orderId);
  console.log(order, "order details");

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  // Verify that only delivered orders can be returned
  if (order.orderStatus !== "delivered") {
    return res.status(400).json({
      success: false,
      message: "Chỉ đơn hàng đã giao mới có thể trả lại.",
    });
  }

  // Update order status to 'trahang'
  order.orderStatus = "trahang";

  // Restock products in inventory
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
          console.log(`Restocked ${item.quantity} units of product ${item.productId}`);
        }
      }
    }
  }

  await order.save();
  console.log(order, "order after updating to trahang status");

  // Refund the order amount to user's wallet if payment was made
  if (order.paymentStatus === "completed" || order.paymentMethod !== "COD") {
    await User.updateOne(
      { _id: order.userId },
      { $inc: { "wallet.balance": order.finalTotal } }
    );
    
    // Add transaction record to user's wallet
    const user = await User.findById(order.userId);
    
    if (user) {
      user.wallet.transactions.push({
        type: "withdrawal",
        amount: order.finalTotal-order.shippingFee,
        status: "completed",
        description: `Hoàn tiền cho đơn hàng trả lại ${orderId}`,
      });
      await user.save();
      console.log(`Refunded ${order.finalTotal} to user wallet`);
    }

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được trả lại thành công, và tiền đã được hoàn vào ví",
      order,
    });
  }

  res.status(200).json({
    success: true,
    message: "Đơn hàng đã được trả lại thành công",
    order,
  });
});