import crypto from "crypto";
import { momoConfig } from "../config/momoConfig.js";
import CatchAsync from "../utils/CatchAsync.js";
import User from "../models/usersModel.js";
import HandelError from "../utils/Error.js";

const generateSignature = (params) => {
  const rawSignature =
    `accessKey=${params.accessKey}` +
    `&amount=${params.amount}` +
    `&extraData=${params.extraData}` +
    `&ipnUrl=${params.ipnUrl}` +
    `&orderId=${params.orderId}` +
    `&orderInfo=${params.orderInfo}` +
    `&partnerCode=${params.partnerCode}` +
    `&redirectUrl=${params.redirectUrl}` +
    `&requestId=${params.requestId}` +
    `&requestType=${params.requestType}`;

  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
};
// Tạo yêu cầu thanh toán MoMo
export const createMomoPayment = CatchAsync(async (req, res, next) => {
  console.log("Nhận yêu cầu MoMo:", req.body);
  try {
    const { amount } = req.body;
    if (!amount || amount < 1000)
      return next(new HandelError("Thiếu dữ liệu đơn hàng", 400));

    const userId = req.user.id;
    const orderId = `ORDER_${Date.now()}_${userId}`;
    const requestId = `REQ_${Date.now()}_${userId}`;

    const payload = {
      accessKey: momoConfig.accessKey,
      amount: amount.toString(),
      extraData: momoConfig.extraData,
      ipnUrl: momoConfig.ipnUrl,
      orderId,
      orderInfo: momoConfig.orderInfo,
      partnerCode: momoConfig.partnerCode,
      redirectUrl: momoConfig.redirectUrl,
      requestId,
      requestType: momoConfig.requestType,
    };

    // Tạo chữ ký MoMo
    payload.signature = generateSignature(payload);

    // Gửi request đến MoMo
    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const jsonResponse = await response.json();
    
    if (jsonResponse.resultCode !== 0) {
      return next(new HandelError(`MoMo Error: ${jsonResponse.message}`, 500));
    }

    // Lưu giao dịch vào DB
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

    return res.status(200).json({
      success: true,
      message: "Payment request created",
      data: {
        orderId,
        amount,
        payUrl: jsonResponse.payUrl,
      },
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
  const signature = generateSignature({
    accessKey: momoConfig.accessKey,
    orderId,
    partnerCode: momoConfig.partnerCode,
    requestId,
  });

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
      await User.updateOne(
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
          message: "Payment completed",
        });
    }

    await User.updateOne(
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
  const user = await User.findById(req.user.id).select("wallet");
  if (!user) return next(new HandelError("User not found", 404));

  res.status(200).json({
    success: true,
    balance: user.wallet.balance,
    transactions: user.wallet.transactions,
  });
});
