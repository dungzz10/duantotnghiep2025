import crypto from "crypto";
import { momoConfig } from "../config/momoConfig.js";
import CatchAsync from "../utils/CatchAsync.js";
import User from "../models/usersModel.js";
import HandelError from "../utils/Error.js";

// Tạo yêu cầu thanh toán MoMo
export const createMomoPayment = CatchAsync(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount || amount < 1000)
    return next(new HandelError("Số tiền phải lớn hơn 1000 VND", 400));

  const userId = req.user.id;
  const orderId = `ORDER_${Date.now()}_${userId}`;
  const requestId = `REQ_${Date.now()}_${userId}`;
  const rawSignature = [
    `accessKey=${momoConfig.accessKey}`,
    `amount=${amount}`,
    `extraData=${momoConfig.extraData}`,
    `ipnUrl=${momoConfig.ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${momoConfig.orderInfo}`,
    `partnerCode=${momoConfig.partnerCode}`,
    `redirectUrl=${momoConfig.redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${momoConfig.requestType}`,
  ].join("&");

  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  try {
    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...momoConfig,
          requestId,
          orderId,
          amount,
          signature,
          partnerName: "Test",
          storeId: "MomoTestStore",
          lang: "vi",
          autoCapture: true,
        }),
      }
    );

    const jsonResponse = await response.json();
    if (jsonResponse.resultCode !== 0)
      throw new Error(`MoMo Error: ${jsonResponse.message}`);

    await User.findByIdAndUpdate(userId, {
      $push: {
        "wallet.transactions": {
          type: "momo_naptien",
          amount,
          momoTransactionId: orderId,
          status: "pending",
          date: new Date(),
          description: momoConfig.orderInfo,
        },
      },
    });

    return res
      .status(200)
      .json({
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

// Xác nhận trạng thái giao dịch
export const verifyTransaction = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const user = await User.findOne({
    "wallet.transactions.momoTransactionId": orderId,
  });

  if (!user) return next(new HandelError("Transaction not found", 404));

  const transaction = user.wallet.transactions.find(
    (t) => t.momoTransactionId === orderId
  );
  const requestId = `${Date.now()}_verify_${orderId}`;
  const rawSignature = `accessKey=${momoConfig.accessKey}&orderId=${orderId}&partnerCode=${momoConfig.partnerCode}&requestId=${requestId}`;
  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  try {
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
    if (result.resultCode === 0 && transaction.status === "pending") {
      await User.findOneAndUpdate(
        { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
        {
          $set: {
            "wallet.transactions.$.status": "completed",
            "wallet.transactions.$.transId": result.transId,
          },
          $inc: { "wallet.balance": transaction.amount },
        }
      );
      return res
        .status(200)
        .json({
          success: true,
          status: "completed",
          amount: transaction.amount,
          transId: result.transId,
          message: "Payment completed",
        });
    }

    await User.findOneAndUpdate(
      { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
      {
        $set: {
          "wallet.transactions.$.status": "failed",
          "wallet.transactions.$.message": result.message,
        },
      }
    );
    return res
      .status(200)
      .json({ success: false, status: "failed", message: result.message });
  } catch (error) {
    return next(new HandelError("Error verifying transaction status", 500));
  }
});

// Lấy số dư ví người dùng
export const getWalletBalance = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("wallet");

  if (!user) return next(new HandelError("User not found", 404));

  res
    .status(200)
    .json({
      success: true,
      balance: user.wallet.balance,
      transactions: user.wallet.transactions,
    });
});
