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

    const userId = req.user?.id;
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
      shippingAddress: {
        address,
        addressType: "home",
      },
      paymentMethod: "MoMo",
      paymentStatus: "pending",
      orderStatus: "pending",
      date: new Date(),
    });

    // Add transaction to user's wallet
    await User.findByIdAndUpdate(userId, {
      $push: {
        "wallet.transactions": {
          type: "muahang",
          amount: total,
          momoTransactionId: orderId,
          status: "pending",
          description: `Thanh toán đơn hàng ${orderId}`,
          date: new Date(),
        },
      },
    });

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
      "wallet.transactions.momoTransactionId": orderId,
    });
    console.log("User found:", user);

    if (!user) return next(new HandelError("Transaction not found", 404));

    const transaction = user.wallet.transactions.find(
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
      // Update transaction status and increase wallet balance for deposits
      if (transaction.type === "momo_naptien") {
        await User.updateOne(
          { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
          {
            $set: {
              "wallet.transactions.$.status": "completed",
            },
            $inc: {
              "wallet.balance": transaction.amount,
            },
          }
        );
      } else {
        // Handle regular purchase transactions
        await User.updateOne(
          { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
          {
            $set: {
              "wallet.transactions.$.status": "completed",
            },
          }
        );
      }

      return res.status(200).json({
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
    const user = await User.findById(req.user.id).select("wallet");
    if (!user) return next(new HandelError("User not found", 404));

    res.status(200).json({
      success: true,
      balance: user.wallet.balance,
      transactions: user.wallet.transactions,
    });
  } catch (error) {
    return next(new HandelError("Lỗi lấy số dư tài khoản", 500));
  }
});

export const createWalletDeposit = CatchAsync(async (req, res, next) => {
  try {
    const { amount } = req.body;
    const total = Number(amount);

    if (!total || isNaN(total) || total < 1000) {
      return next(
        new HandelError("Số tiền nạp không hợp lệ (tối thiểu 1.000đ)", 400)
      );
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(new HandelError("Người dùng chưa xác thực", 401));
    }

    const orderId = `DEPOSIT_${Date.now()}_${userId}`;
    const requestId = `REQ_${Date.now()}_${userId}`;

    // Create MoMo payment request
    const payload = {
      accessKey: momoConfig.accessKey,
      amount: total.toString(),
      extraData: "wallet_deposit",
      ipnUrl: momoConfig.ipnUrl,
      orderId,
      orderInfo: "Nạp tiền vào ví",
      partnerCode: momoConfig.partnerCode,
      redirectUrl: momoConfig.redirectUrl,
      requestId,
      requestType: "captureWallet",
    };

    payload.signature = generateSignature(payload);
    console.log("MoMo Deposit Payload:", payload);

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const jsonResponse = await response.json();
    // console.log("MoMo Deposit Response:", jsonResponse);
    if (!response.ok || jsonResponse.resultCode !== 0) {
      return next(
        new HandelError(
          `MoMo Error: ${jsonResponse.message || response.statusText}`,
          500
        )
      );
    }

    // Add pending transaction to user's wallet
    await User.findByIdAndUpdate(userId, {
      $push: {
        "wallet.transactions": {
          type: "momo_naptien",
          amount: total,
          momoTransactionId: orderId,
          status: "pending",
          description: `Nạp tiền vào ví ${orderId}`,
          date: new Date(),
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tạo yêu cầu nạp tiền thành công",
      data: { orderId, amount: total, payUrl: jsonResponse.payUrl },
    });
  } catch (error) {
    return next(
      new HandelError(`Lỗi tạo yêu cầu nạp tiền: ${error.message}`, 500)
    );
  }
});
