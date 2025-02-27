import Order from "../models/orderModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";

export const getOrderById = CatchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.orderId });

  if (!order) {
    return next(new HandelError("Không tìm thấy đơn hàng", 404));
  }

  res.status(200).json({ success: true, order });
});
