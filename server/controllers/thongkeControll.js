import Order from "../models/orderModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";

// Thống kê 10 user đặt hàng nhiều nhất
export const topUsers = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const users = await Order.aggregate([
    {
      $match: {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }, 
      },
    },
    {
      $lookup: {
        from: "users", 
        localField: "userId", 
        foreignField: "_id", 
        as: "userDetails", 
      },
    },
    { $unwind: "$userDetails" }, 
    {
      $group: {
        _id: "$userId", 
        name: { $first: "$userDetails.name" }, 
        totalOrders: { $sum: 1 }, 
      },
    },
    { $sort: { totalOrders: -1 } }, 
    { $limit: 10 }, 
  ]);

  console.log(users);

  res.status(200).json({
    success: true,
    data: users,
  });
});

// Thống kê 10 sản phẩm bán chạy nhất
export const topProducts = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const products = await Order.aggregate([
    {
      $match: {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId", // Nhóm theo productId
        title: { $first: "$products.title" }, // Lấy tên sản phẩm
        totalQuantity: { $sum: "$products.quantity" }, // Tổng số lượng sản phẩm bán được
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
  ]);
  console.log(products);

  res.status(200).json({
    success: true,
    data: products,
  });
});

// Thống kê đơn hàng theo khoảng thời gian
export const orderStatistics = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const stats = await Order.aggregate([
    {
      $match: {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 }, // Tổng số đơn hàng
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

// Thống kê tỷ lệ thành công của đơn hàng
export const orderSuccessRate = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const successRate = await Order.aggregate([
    {
      $match: {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        successfulOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0], // Đếm số đơn hàng thành công
          },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: successRate,
  });
});
