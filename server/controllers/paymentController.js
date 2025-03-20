import crypto from "crypto";
import { momoConfig } from "../config/momoConfig.js";
import { paymentConfig, getRedirectUrl } from "../config/paymentConfig.js";
import CatchAsync from "../utils/CatchAsync.js";
import User from "../models/usersModel.js";
import HandelError from "../utils/Error.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const generateSignature = (params) => {
  const rawSignature = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHmac("sha256", paymentConfig.secretKey)
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
    const redirectUrl = getRedirectUrl(paymentType);
    const payload = {
      accessKey: paymentConfig.accessKey,
      amount: amount.toString(),
      extraData: paymentConfig.extraData || "",
      ipnUrl: paymentConfig.ipnUrl,
      orderId,
      orderInfo: paymentConfig.orderInfo || "Thanh toán qua MoMo",
      partnerCode: paymentConfig.partnerCode,
      redirectUrl,
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
      message: "Tạo đươn hàng thành công",
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
  console.log("Phương thức thanh toán Order ID:", orderId);
  console.log("Request user:", req.user); // Log để kiểm tra thông tin user

  // Kiểm tra xem req.user có tồn tại không
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
    });
  }

  try {
    // Tìm user bằng ID thay vì tìm bằng transaction
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
    }

    // Sau đó tìm transaction phù hợp
    const walletTransaction = user.wallet?.transactions?.find(
      (t) => t.momoTransactionId === orderId
    );
    const atmTransaction = user.ATM?.transactions?.find(
      (t) => t.momoTransactionId === orderId
    );
    const transaction = walletTransaction || atmTransaction;

    if (!transaction) {
      console.log("Không tìm thấy giao dịch với ID:", orderId);
      console.log("Wallet transactions:", user.wallet?.transactions);
      console.log("ATM transactions:", user.ATM?.transactions);

      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giao dịch với mã này.",
      });
    }

    console.log("Transaction found:", transaction);

    const requestId = `VERIFY_${orderId}`;
    const signature = generateSignature({
      accessKey: paymentConfig.accessKey,
      orderId,
      partnerCode: paymentConfig.partnerCode,
      requestId,
    });

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/query",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerCode: paymentConfig.partnerCode,
          requestId,
          orderId,
          signature,
          lang: "vi",
        }),
      }
    );

    const result = await response.json();
    console.log("MoMo API result:", result);

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

      // Kiểm tra xem có phải là nạp tiền vào ví không
      if (orderId.startsWith("DEPOSIT")) {
        return res.status(200).json({
          success: true,
          message: "Nạp tiền thành công.",
        });
      }

      // Nếu là đơn hàng
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

      const updatedOrder = await Order.findById(order._id);

      if (updatedOrder && updatedOrder.paymentStatus === "completed") {

        await User.updateOne(
          { _id: user._id },
          {
            $pull: {
              cart: {
                $or: updatedOrder.products.map((p) => ({
                  productId: p.productId,
                  color: p.color,
                  size: p.size,
                })),
              },
            },
          }
        );
        
        for (const product of updatedOrder.products) {
          const { productId, color, size, quantity } = product;
        
          await Product.updateOne(
            {
              _id: productId,
              "variants.color": color,
              "variants.sizes.size": size,
            },
            {
              $inc: {
                "variants.$[colorFilter].sizes.$[sizeFilter].quantity": -quantity,
              },
            },
            {
              arrayFilters: [
                { "colorFilter.color": color },
                { "sizeFilter.size": size },
              ],
            }
          );
        }

        let transactions = [];

        if (walletTransaction) {
          transactions = user.wallet.transactions;
        } else if (atmTransaction) {
          transactions = user.ATM.transactions;
        }
        return res.status(200).json({
          success: true,
          message:
            "Thanh toán thành công. Bạn sẽ được chuyển hướng về trang chủ sau 5 giây.",
          order: updatedOrder,
          transactions,
          redirect: true,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Cập nhật trạng thái đơn hàng thất bại.",
        });
      }
    } else {
      if (result.resultCode !== 0) {
        return res.status(400).json({
          success: false,
          message: `Xác thực giao dịch thất bại: ${result.message}`,
        });
      }
      if (transaction.status === "completed") {
        return res.status(200).json({
          success: true,
          message: "Giao dịch đã được xác nhận trước đó.",
        });
      }
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: `Lỗi xác thực giao dịch: ${error.message}`,
    });
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
// nap tien vao vi
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
export const ipnNotification = CatchAsync(async (req, res, next) => {
  const { orderId, resultCode, message, amount, transId } = req.body;
  console.log("Nhận IPN từ MoMo:", req.body);

  try {
    // Verify signature from MoMo (similar to verifyTransaction)
    const requestId = `IPN_${orderId}`;
    const signature = generateSignature({
      accessKey: momoConfig.accessKey,
      orderId,
      partnerCode: momoConfig.partnerCode,
      requestId,
    });

    // For additional security, you may want to verify the signature from IPN
    // but since MoMo's webhook doesn't expect a verification call, we'll process directly

    if (resultCode === 0) {
      // Check if this is a wallet deposit
      if (orderId.startsWith("DEPOSIT")) {
        // Extract userId from deposit orderId format: DEPOSIT_timestamp_userId
        const userId = orderId.split("_")[2];

        if (!userId) {
          return res.status(400).json({
            success: false,
            message: "Invalid deposit order ID format",
          });
        }

        // Update user wallet transaction
        await User.updateOne(
          { _id: userId, "wallet.transactions.momoTransactionId": orderId },
          {
            $set: { "wallet.transactions.$.status": "completed" },
            $inc: { "wallet.balance": Number(amount) },
          }
        );

        return res.status(200).json({
          success: true,
          message: "Nạp tiền thành công",
        });
      }

      // If it's a regular order
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng tương ứng",
        });
      }

      // Update order status
      await Order.updateOne(
        { orderId },
        { $set: { paymentStatus: "completed", orderStatus: "processing" } }
      );

      // Find payment method (wallet or ATM) based on order info
      const user = await User.findById(order.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      // Update transaction status in appropriate payment method
      const walletTransaction = user.wallet?.transactions?.find(
        (t) => t.momoTransactionId === orderId
      );
      const atmTransaction = user.ATM?.transactions?.find(
        (t) => t.momoTransactionId === orderId
      );

      if (walletTransaction) {
        await User.updateOne(
          { _id: user._id, "wallet.transactions.momoTransactionId": orderId },
          { $set: { "wallet.transactions.$.status": "completed" } }
        );
      } else if (atmTransaction) {
        await User.updateOne(
          { _id: user._id, "ATM.transactions.momoTransactionId": orderId },
          { $set: { "ATM.transactions.$.status": "completed" } }
        );
      }

      return res.status(200).json({
        success: true,
        message: "Thanh toán đã được xử lý thành công",
        transactionId: transId || order.orderId,
      });
    } else {
      // Handle failed payment case
      // If it's a regular order, update the order status to failed
      if (!orderId.startsWith("DEPOSIT")) {
        await Order.updateOne(
          { orderId },
          { $set: { paymentStatus: "failed" } }
        );
      }

      // Update transaction status to failed in user document
      await User.updateOne(
        { "wallet.transactions.momoTransactionId": orderId },
        { $set: { "wallet.transactions.$.status": "failed" } }
      );

      await User.updateOne(
        { "ATM.transactions.momoTransactionId": orderId },
        { $set: { "ATM.transactions.$.status": "failed" } }
      );

      return res.status(200).json({
        success: false,
        message: `Thanh toán thất bại: ${message || "Unknown error"}`,
      });
    }
  } catch (error) {
    console.error("Lỗi xử lý IPN:", error);
    // Always return 200 to MoMo even if there's an error to acknowledge receipt
    return res.status(200).json({
      success: false,
      message: `Lỗi xử lý thanh toán: ${error.message}`,
    });
  }
});

//  thanh toán bằng ví
export const createWalletPayment = CatchAsync(async (req, res, next) => {
  const { amount, shippingAddress, products, finalTotal } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return next(new HandelError("Người dùng chưa xác thực", 401));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandelError("Người dùng không tồn tại", 404));
  }

  if (user.wallet.balance < finalTotal) {
    return next(new HandelError("Số dư ví không đủ", 400));
  }

  user.wallet.balance -= finalTotal;
  const orderId = `ORDER_${Date.now()}`;
  const newOrder = await Order.create({
    userId,
    shippingAddress,
    orderId,
    amount: finalTotal,
    finalTotal,
    products,
    paymentMethod: "WALLET",
    paymentStatus: "completed",
    orderStatus: "processing",
    date: new Date(),
  });

  const transactionData = {
    type: "muahang",
    amount: finalTotal,
    momoTransactionId: orderId,
    status: "completed",
    description: `Thanh toán đơn hàng ${orderId}`,
    date: new Date(),
  };

  user.wallet.transactions.push(transactionData);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Thanh toán từ ví thành công",
    data: { orderId, amount: finalTotal },
    order: newOrder,
  });
});
