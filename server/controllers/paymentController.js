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
    const { amount, products, finalTotal, paymentType } = req.body;
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
    const generateOrderId = () =>
      `${Math.random().toString(36).toUpperCase().slice(2, 6)}-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

    const orderId = generateOrderId();
    const requestId = generateOrderId();
    const requestType = paymentType === "atm" ? "payWithATM" : "captureWallet";

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
      requestType,
    };

    payload.signature = generateSignature(payload);
console.log("MoMo Payload:", payload);

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const jsonResponse = await response.json();
    console.log("MoMo Response:", jsonResponse);
    
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

    const transactionData = {
      type: "muahang",
      amount: total,
      momoTransactionId: orderId,
      status: "pending",
      description: `Thanh toán đơn hàng ${orderId}`,
      date: new Date(),
    };

    const updateQuery =
      paymentType === "atm"
        ? { $push: { "ATM.transactions": transactionData } }
        : { $push: { "wallet.transactions": transactionData } };

    await User.findByIdAndUpdate(userId, updateQuery);

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
  console.log(" Phương thức thanh toán Order ID:", orderId);

  try {
    const user = await User.findOne({
      $or: [
        { "wallet.transactions.momoTransactionId": orderId },
        { "ATM.transactions.momoTransactionId": orderId },
      ],
    });

    if (!user) return next(new HandelError("Transaction not found", 404));

    const walletTransaction = user.wallet?.transactions?.find(
      (t) => t.momoTransactionId === orderId
    );
    const atmTransaction = user.ATM?.transactions?.find(
      (t) => t.momoTransactionId === orderId
    );
    const transaction = walletTransaction || atmTransaction;

    if (!transaction)
      return next(new HandelError("Transaction data missing", 404));

    console.log(" Transaction found:", transaction);

    const requestId = `VERIFY_${orderId}`;
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

    if (!walletTransaction && !atmTransaction) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy giao dịch hợp lệ.",
      });
    }

    const isSuccess = result.resultCode === 0;

    if (isSuccess && transaction.status === "pending") {
      if (walletTransaction) {
        await User.updateOne(
          { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
          {
            $set: { "wallet.transactions.$.status": "completed" },
            $inc: { "wallet.balance": transaction.amount },
          },
          { new: true }
        );
      } else if (atmTransaction) {
        await User.updateOne(
          { _id: user._id, "ATM.transactions.momoTransactionId": orderId },
          {
            $set: { "ATM.transactions.$.status": "completed" },
            $inc: { "ATM.balance": transaction.amount },
          },
          { new: true }
        );
      }
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Không tìm thấy đơn hàng tương ứng.",
        });
      }
      await Order.updateOne(
        { _id: order._id },
        { $set: { orderStatus: "processing", paymentStatus: "completed" } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công.",
      });
    }

    if (result.resultCode === 7002) {
      return res.status(400).json({
        success: false,
        message: "Lỗi xác thực chữ ký. Vui lòng thử lại.",
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message || "Giao dịch thất bại.",
    });
  } catch (error) {
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
