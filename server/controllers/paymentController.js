import crypto from "crypto";
import { momoConfig } from "../config/momoConfig.js";
import CatchAsync from "../utils/CatchAsync.js";
import User from "../models/usersModel.js";
import HandelError from "../utils/Error.js";
import Order from "../models/orderModel.js";

const generateSignature = (params) => {
  const rawSignature = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
};

export const createMomoPayment = CatchAsync(async (req, res, next) => {
  console.log("Nhận yêu cầu MoMo:", req.body);
  try {
    const { amount, products, finalTotal } = req.body;
    const total = finalTotal || amount;
if (!total || isNaN(total) || total < 1000) {
  return next(new HandelError("Số tiền thanh toán không hợp lệ", 400));
}

    const { shippingAddress } = req.body;
    const address = shippingAddress?.address || "home";
    // Kiểm tra dữ liệu hợp lệ
    if (!amount || isNaN(amount) || amount < 1000) {
      return next(new HandelError("Số tiền không hợp lệ", 400));
    }

    const userId = req.user?.id; // Kiểm tra userId hợp lệ
    if (!userId) {
      return next(new HandelError("Người dùng chưa xác thực", 401));
    }

    const orderId = `ORDER_${Date.now()}_${userId}`;
    const requestId = `REQ_${Date.now()}_${userId}`;

    const payload = {
      accessKey: momoConfig.accessKey,
      amount: amount.toString(),
      extraData: momoConfig.extraData || "",
      ipnUrl: momoConfig.ipnUrl,
      orderId,
      orderInfo: momoConfig.orderInfo || "Thanh toán qua MoMo",
      partnerCode: momoConfig.partnerCode,
      redirectUrl: momoConfig.redirectUrl,
      requestId,
      requestType: momoConfig.requestType || "captureWallet",
    };

    payload.signature = generateSignature(payload);

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const jsonResponse = await response.json();
    if (!response.ok || jsonResponse.resultCode !== 0) {
      return next(
        new HandelError(
          `MoMo Error: ${jsonResponse.message || response.statusText}`,
          500
        )
      );
    }

    const newOrder = await Order.create({
      userId,
      orderId,
      amount: total, 
      finalTotal: total, 
      products,
      shippingAddress: { address }, 
      status: "pending",
      paymentMethod: "MoMo", 
      date: new Date(),
    });

    console.log("Đơn hàng đã được lưu vào DB:", newOrder);

    return res.status(200).json({
      success: true,
      message: "Payment request created",
      data: { orderId, amount, payUrl: jsonResponse.payUrl },
    });
  } catch (error) {
    return next(
      new HandelError(`Payment creation failed: ${error.message}`, 500)
    );
  }
});

export const verifyTransaction = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  console.log("Verify Transaction Order ID:", orderId);
  try {
    const user = await User.findOne({
      "ATM.transactions.momoTransactionId": orderId,
    });
    if (!user) return next(new HandelError("Transaction not found", 404));

    const transaction = user.ATM.transactions.find(
      (t) => t.momoTransactionId === orderId
    );
    if (!transaction)
      return next(new HandelError("Transaction data missing", 404));

    const requestId = `REQ_VERIFY_${Date.now()}_${orderId}`;
    const signature = generateSignature({
      accessKey: momoConfig.accessKey,
      orderId,
      partnerCode: momoConfig.partnerCode,
      requestId,
    });

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/query",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerCode: momoConfig.partnerCode,
          requestId,
          orderId,
          signature,
          lang: "vi",
        }),
      }
    );

    const result = await response.json();
    console.log("MoMo API Response:", result);
    if (result.resultCode === 0 && transaction.status === "pending") {
      console.log("Transaction completed, updating user data.");
      await User.updateOne(
        { _id: user._id, "ATM.transactions.momoTransactionId": orderId },
        {
          $set: {
            "ATM.transactions.$.status": "completed",
            "ATM.transactions.$.transId": result.transId,
          },
          $inc: { "ATM.balance": transaction.amount },
        }
      );
      return res
        .status(200)
        .json({
          success: true,
          status: "completed",
          message: "Payment completed",
        });
    }

    await User.updateOne(
      { _id: user._id, "ATM.transactions.momoTransactionId": orderId },
      {
        $set: {
          "ATM.transactions.$.status": "completed",
          "ATM.transactions.$.transId": result.transId,
        },
        $inc: { "ATM.balance": transaction.amount },
      }
    );
    return res
      .status(200)
      .json({ success: false, status: "failed", message: result.message });
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return next(
      new HandelError(`Error verifying transaction: ${error.message}`, 500)
    );
  }
});

export const getWalletBalance = CatchAsync(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("ATM");
    if (!user) return next(new HandelError("User not found", 404));

    res.status(200).json({
      success: true,
      balance: user.ATM.balance,
      transactions: user.ATM.transactions,
    });
  } catch (error) {
    return next(new HandelError("Lỗi lấy số dư tài khoản", 500));
  }
});
