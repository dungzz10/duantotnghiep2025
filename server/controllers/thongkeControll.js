import Order from "../models/orderModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
import Product from "../models/productModel.js";
import moment from "moment-timezone";

// Thống kê 10 user đặt hàng nhiều nhất
export const topUsers = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  const users = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end }, // Sử dụng đối tượng Date đã kiểm tra
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
        successfulOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0], // Đếm số đơn hàng đã giao
          },
        },
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

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  const products = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        title: { $first: "$products.name" },
        image: { $first: "$products.image" },

        totalQuantity: { $sum: "$products.quantity" },
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
  console.log(startDate, endDate, 888888);

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  const stats = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const orders = await Order.find({
    date: { $gte: start, $lte: end },
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
    data: stats,
    orders: orders,
  });
});

// Thống kê tỷ lệ thành công của đơn hàng
export const orderSuccessRate = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  const successRate = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        successfulOrders: {
          $sum: {
            $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0],
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
// Thống kê tổng lợi nhuận trong khoảng thời gian
export const totalProfit = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Đảm bảo tính đến hết ngày
  start.setHours(0, 0, 0, 0); // Bắt đầu từ đầu ngày

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  // Tính tổng lợi nhuận trong khoảng thời gian
  const orders = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        orderStatus: { $in: ["delivered", "completed"] }, // Chỉ tính đơn hàng đã giao
      },
    },
    {
      $group: {
        _id: null,
        totalProfit: {
          $sum: {
            $subtract: [
              "$finalTotal", // Tổng tiền của đơn hàng
              { $add: ["$shippingFee", "$voucherDiscount"] }, // Trừ đi chi phí vận chuyển và giảm giá
            ],
          },
        },
      },
    },
  ]);

  const totalProfit = orders[0]?.totalProfit || 0; // Nếu không có đơn hàng thì trả về 0

  res.status(200).json({
    success: true,
    totalProfit,
  });
});
// Thống kê đơn hàng đã giao hàng với tên và số lượng sản phẩm
export const deliveredOrders = CatchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  // Kiểm tra và chuyển đổi startDate, endDate thành đối tượng Date
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  // Kiểm tra tính hợp lệ của ngày tháng
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ success: false, message: "Invalid dates." });
  }

  const deliveredStats = await Order.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
        orderStatus: "delivered",
      },
    },
    { $unwind: "$products" }, // Tách các sản phẩm trong đơn hàng
    {
      $group: {
        _id: "$products.productId", // Nhóm theo productId
        productName: { $first: "$products.name" }, // Lấy tên sản phẩm
        productPrice: {
          $first: {
            $subtract: ["$products.totalPrice", "$voucherDiscount"],
          },
        }, // Tính giá sản phẩm sau khi trừ voucherDiscount
        totalQuantity: { $sum: "$products.quantity" }, // Tính tổng số lượng của sản phẩm
      },
    },
    { $sort: { totalQuantity: -1 } }, // Sắp xếp theo tổng số lượng giảm dần
  ]);

  res.status(200).json({
    success: true,
    data: deliveredStats,
  });
});

// Thống kê doanh thu theo thời gian (ngày, tuần, tháng, năm)
export const getRevenueStatistics = CatchAsync(async (req, res, next) => {
  const {
    startDate,
    endDate,
    type = "day",
    timezone = "Asia/Ho_Chi_Minh",
  } = req.query;

  const start = moment(startDate).tz(timezone).startOf("day").toDate();
  const end = moment(endDate).tz(timezone).endOf("day").toDate();

  let groupBy;
  let dateField = "$updatedAt"; // Thay đổi từ date sang updatedAt

  switch (type) {
    case "week":
      groupBy = { $week: dateField };
      break;
    case "month":
      groupBy = {
        $dateToString: {
          format: "%Y-%m",
          date: dateField,
          timezone: timezone,
        },
      };
      break;
    case "year":
      groupBy = {
        $dateToString: {
          format: "%Y",
          date: dateField,
          timezone: timezone,
        },
      };
      break;
    default:
      // day
      groupBy = {
        $dateToString: {
          format: "%Y-%m-%d",
          date: dateField,
          timezone: timezone,
        },
      };
  }

  const revenueStats = await Order.aggregate([
    {
      $match: {
        updatedAt: { $gte: start, $lte: end }, // Thay đổi từ date sang updatedAt
        orderStatus: "delivered", // Chỉ lấy đơn hàng đã giao
      },
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: "$finalTotal" },
        orders: { $sum: 1 },
        avgOrderValue: { $avg: "$finalTotal" },
        // Thêm thông tin thời gian giao hàng
        deliveryDate: { $first: "$updatedAt" },
      },
    },
    {
      $addFields: {
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$deliveryDate",
            timezone: timezone,
          },
        },
      },
    },
    { $sort: { deliveryDate: 1 } },
  ]);

  console.log("Generated revenue stats:", revenueStats);

  res.status(200).json({
    success: true,
    data: revenueStats,
  });
});
