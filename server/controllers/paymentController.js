import crypto from "crypto"; // Thư viện crypto để tạo chữ ký HMAC
import { momoConfig } from "../config/momoConfig.js"; // Cấu hình MoMo
import CatchAsync from "../utils/CatchAsync.js"; // Bắt lỗi bất đồng bộ
import User from "../models/usersModel.js"; // Model người dùng
import HandelError from "../utils/Error.js"; // Xử lý lỗi

// Tạo yêu cầu thanh toán MoMo
export const createMomoPayment = CatchAsync(async (req, res, next) => {
  const { amount } = req.body;

  // Validate amount
  if (!amount || amount < 1000) {
    return next(new HandelError("Số tiền phải lớn hơn 1000 VND", 400));
  }

  const userId = req.user.id;
  const requestId = `REQ_${Date.now()}_${userId}`;
  const orderId = `ORDER_${Date.now()}_${userId}`;

  // Tạo chuỗi rawSignature
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

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: momoConfig.orderInfo,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: "vi",
    requestType: momoConfig.requestType,
    autoCapture: true,
    extraData: momoConfig.extraData,
    signature: signature,
  };

  try {
    console.log("Sending request to MoMo:", requestBody);

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const jsonResponse = await response.json();
    console.log("MoMo response:", jsonResponse);

    if (jsonResponse.resultCode === 0) {
      // Save transaction to user's wallet
      await User.findByIdAndUpdate(userId, {
        $push: {
          "wallet.transactions": {
            type: "momo_naptien", // Changed from momo_payment to momo_naptien
            amount: amount,
            momoTransactionId: orderId,
            status: "pending",
            date: new Date(),
            description: momoConfig.orderInfo,
          },
        },
      });

      // Return success response with payment links
      return res.status(200).json({
        success: true,
        message: "Payment request created successfully",
        data: {
          orderId: orderId,
          amount: amount,
          payUrl: jsonResponse.payUrl,
        },
      });
    } else {
      throw new Error(
        `MoMo Error: ${jsonResponse.message} (Code: ${jsonResponse.resultCode})`
      );
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    return next(
      new HandelError(
        `Payment creation failed: ${error.message}. Please try again.`,
        500
      )
    );
  }
});

// Xác nhận trạng thái giao dịch
export const verifyTransaction = CatchAsync(async (req, res, next) => {
  const { orderId } = req.params; // Lấy orderId từ tham số URL

  // Tìm giao dịch trong cơ sở dữ liệu
  const user = await User.findOne({
    "wallet.transactions": {
      $elemMatch: { momoTransactionId: orderId },
    },
  });

  if (!user) {
    return next(new HandelError("Transaction not found", 404)); // Nếu không tìm thấy giao dịch
  }

  const transaction = user.wallet.transactions.find(
    (t) => t.momoTransactionId === orderId // Tìm giao dịch theo orderId
  );

  // Kiểm tra trạng thái giao dịch với MoMo API
  const requestId = `${Date.now()}_verify_${orderId}`; // Tạo requestId duy nhất cho việc xác minh
  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&orderId=${orderId}` +
    `&partnerCode=${momoConfig.partnerCode}` +
    `&requestId=${requestId}`;

  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  try {
    // Gửi yêu cầu xác minh trạng thái giao dịch
    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Định dạng yêu cầu là JSON
        },
        body: JSON.stringify({
          partnerCode: momoConfig.partnerCode,
          requestId: requestId,
          orderId: orderId,
          signature: signature,
          lang: "vi", // Đặt ngôn ngữ là tiếng Việt
        }),
      }
    );

    const result = await response.json(); // Chuyển đổi phản hồi thành JSON

    // Cập nhật trạng thái giao dịch nếu cần thiết
    if (result.resultCode === 0 && transaction.status === "pending") {
      // Cập nhật trạng thái giao dịch thành "completed"
      await User.findOneAndUpdate(
        {
          _id: user._id,
          "wallet.transactions.momoTransactionId": orderId,
        },
        {
          $set: {
            "wallet.transactions.$.status": "completed",
            "wallet.transactions.$.transId": result.transId,
          },
          $inc: { "wallet.balance": transaction.amount }, // Cập nhật số dư ví
        }
      );

      return res.status(200).json({
        success: true,
        status: "completed", // Trạng thái giao dịch
        amount: transaction.amount, // Số tiền giao dịch
        transId: result.transId, // Mã giao dịch
        message: "Payment completed successfully", // Thông báo thành công
      });
    } else if (result.resultCode !== 0 && transaction.status === "pending") {
      // Cập nhật trạng thái giao dịch thành "failed" nếu giao dịch không thành công
      await User.findOneAndUpdate(
        {
          _id: user._id,
          "wallet.transactions.momoTransactionId": orderId,
        },
        {
          $set: {
            "wallet.transactions.$.status": "failed", // Cập nhật trạng thái thành "failed"
            "wallet.transactions.$.message": result.message, // Lưu thông điệp lỗi
          },
        }
      );

      return res.status(200).json({
        success: false,
        status: "failed",
        message: result.message, // Thông báo lỗi
      });
    }

    // Trả về trạng thái giao dịch nếu đã được cập nhật
    return res.status(200).json({
      success: true,
      status: transaction.status,
      amount: transaction.amount,
      transId: transaction.transId,
      message: transaction.message || "Transaction status unchanged", // Thông điệp mặc định
    });
  } catch (error) {
    console.error("Error verifying transaction:", error); // Ghi lỗi nếu có vấn đề khi xác minh
    return next(new HandelError("Error verifying transaction status", 500)); // Trả lỗi nếu xác minh không thành công
  }
});

// Lấy số dư ví người dùng
export const getWalletBalance = CatchAsync(async (req, res, next) => {
  const userId = req.user.id; // Lấy userId từ thông tin người dùng

  const user = await User.findById(userId).select("wallet"); // Lấy thông tin ví của người dùng

  if (!user) {
    return next(new HandelError("User not found", 404)); // Nếu không tìm thấy người dùng, trả lỗi
  }

  res.status(200).json({
    success: true,
    balance: user.wallet.balance, // Trả về số dư ví
    transactions: user.wallet.transactions, // Trả về danh sách giao dịch
  });
});
