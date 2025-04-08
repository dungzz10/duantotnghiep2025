import Voucher from "../models/voucherModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";

// Tạo voucher mới
export const createVoucher = CatchAsync(async (req, res) => {
  const newVoucher = await Voucher.create(req.body);
  res.status(201).json({
    success: true,
    message: "Tạo voucher thành công",
    data: newVoucher,
  });
});

// Lấy danh sách voucher
export const getAllVouchers = CatchAsync(async (req, res) => {
  let query = {};

  const vouchers = await Voucher.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: vouchers.length,
    data: vouchers,
  });
});

// Lấy chi tiết voucher
export const getVoucherById = CatchAsync(async (req, res, next) => {
  const voucher = await Voucher.findById(req.params.id);

  if (!voucher) {
    return next(new HandelError("Không tìm thấy voucher", 404));
  }

  res.status(200).json({
    success: true,
    data: voucher,
  });
});

// Cập nhật voucher
export const updateVoucher = CatchAsync(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!voucher) {
    return next(new HandelError("Không tìm thấy voucher", 404));
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật voucher thành công",
    data: voucher,
  });
});

// Xóa voucher
export const deleteVoucher = CatchAsync(async (req, res, next) => {
  const voucher = await Voucher.findByIdAndDelete(req.params.id);

  if (!voucher) {
    return next(new HandelError("Không tìm thấy voucher", 404));
  }

  res.status(200).json({
    success: true,
    message: "Xóa voucher thành công",
  });
});

// Kiểm tra và áp dụng voucher
export const applyVoucher = CatchAsync(async (req, res, next) => {
  const { code, orderValue, userId } = req.body;

  const voucher = await Voucher.findOne({
    code: code.toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    quantity: { $gt: 0 },
  });

  if (!voucher) {
    return next(new HandelError("Voucher không hợp lệ hoặc đã hết hạn", 400));
  }

  if (orderValue < voucher.minOrderValue) {
    return next(
      new HandelError(
        `Giá trị đơn hàng tối thiểu là ${voucher.minOrderValue}đ`,
        400
      )
    );
  }

  // Kiểm tra số lần sử dụng của user
  const userUsageCount = voucher.usedBy.filter(
    (use) => use.userId.toString() === userId.toString()
  ).length;

  if (userUsageCount >= voucher.conditions.userUsageLimit) {
    return next(
      new HandelError(
        "Bạn đã sử dụng tối đa số lần cho phép của voucher này",
        400
      )
    );
  }

  // Tính giá trị giảm giá
  let discountAmount;
  if (voucher.type === "percentage") {
    discountAmount = Math.min(
      (orderValue * voucher.value) / 100,
      voucher.maxDiscount
    );
  } else {
    discountAmount = Math.min(voucher.value, orderValue);
  }

  res.status(200).json({
    success: true,
    data: {
      discountAmount,
      voucher,
    },
  });
});
