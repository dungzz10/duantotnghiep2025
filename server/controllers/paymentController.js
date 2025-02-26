import crypto from "crypto"; // Thư viện crypto để tạo chữ ký HMAC
import { momoConfig } from "../config/momoConfig.js"; // Cấu hình MoMo
import CatchAsync from "../utils/CatchAsync.js"; // Bắt lỗi bất đồng bộ
import User from "../models/usersModel.js"; // Model người dùng
import HandelError from "../utils/Error.js"; // Xử lý lỗi

// Tạo yêu cầu thanh toán MoMo
export const createMomoPayment = CatchAsync(async (req, res, next) => {
  const { amount } = req.body; // Lấy số tiền từ body của yêu cầu

  if (!amount || amount < 50000) {
    return next(new HandelError("Amount must be at least 50000 VND", 400)); // Trả lỗi nếu không hợp lệ
  }

  const userId = req.user.id; // Lấy userId từ req.user
  const requestId = `${Date.now()}_${userId}`; // Tạo requestId từ thời gian và userId
  const orderId = requestId; // Đặt orderId bằng requestId

  // Tạo chuỗi rawSignature để xác thực yêu cầu
  const rawSignature =
    `accessKey=${momoConfig.accessKey}` +
    `&amount=${amount}` +
    `&extraData=${momoConfig.extraData}` +
    `&ipnUrl=${momoConfig.ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${momoConfig.orderInfo}` +
    `&partnerCode=${momoConfig.partnerCode}` +
    `&redirectUrl=${momoConfig.redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${momoConfig.requestType}`;

  // Tạo chữ ký HMAC-SHA256 từ rawSignature
  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
  // console.log("abc",rawSignature)
  // console.log(signature)
  // Xây dựng requestBody gửi cho MoMo
  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: momoConfig.orderInfo,
    redirectUrl: momoConfig.redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    extraData: momoConfig.extraData,
    requestType: momoConfig.requestType,
    signature: signature,
    lang: momoConfig.lang,
  };

  try {
    // Gửi yêu cầu thanh toán tới MoMo API
    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Định dạng yêu cầu là JSON
        },
        body: JSON.stringify(requestBody), // Chuyển đổi requestBody thành chuỗi JSON
      }
    );

    const jsonResponse = await response.json(); // Chuyển đổi phản hồi từ MoMo thành JSON
    console.log("json", jsonResponse);

    // Kiểm tra kết quả thanh toán
    if (jsonResponse.resultCode === 0) {
      const user = await User.findById(userId); // Tìm người dùng
      user.wallet.transactions.push({
        // Thêm giao dịch vào ví người dùng
        type: "momo_payment",
        amount: amount,
        momoTransactionId: orderId,
        status: "pending", // Trạng thái giao dịch là "pending"
        description: momoConfig.orderInfo,
      });
      await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

      // Kiểm tra trạng thái thanh toán
      const paymentStatus = await handleMomoPaymentStatus(
        orderId,
        amount,
        userId
      );

      // Nếu thanh toán thành công, cập nhật trạng thái giao dịch

      if (paymentStatus.success) {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: userId,
            "wallet.transactions.momoTransactionId": orderId,
          },
          {
            $set: {
              "wallet.transactions.$.status": "completed", // Cập nhật trạng thái thành "completed"
              "wallet.transactions.$.transId": paymentStatus.transId, // Thêm mã giao dịch
            },
            $inc: { "wallet.balance": amount }, // Cập nhật số dư ví người dùng
          },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Payment completed successfully", // Thông báo thanh toán thành công
          balance: updatedUser.wallet.balance, // Trả về số dư ví mới
          payUrl: jsonResponse.payUrl, // URL thanh toán MoMo
          orderId: orderId, // ID đơn hàng
        });
      }

      // Trả về URL thanh toán nếu chưa hoàn tất
      return res.status(200).json({
        success: true,
        payUrl: jsonResponse.payUrl,
        orderId: orderId,
      });
    } else {
      // Nếu có lỗi, ném lỗi từ MoMo
      throw new Error(
        `MoMo Error: ${jsonResponse.message} (${jsonResponse.resultCode})`
      );
    }
  } catch (error) {
    console.error("Payment creation error:", error); // Ghi lỗi nếu có lỗi
    return next(
      new HandelError(`Payment creation failed: ${error.message}`, 500) // Trả lỗi nếu thanh toán không thành công
    );
  }
});

// Kiểm tra trạng thái thanh toán
const handleMomoPaymentStatus = async (orderId, amount, userId) => {
  try {
    const requestId = `${Date.now()}_status_${orderId}`; // Tạo requestId duy nhất cho việc kiểm tra trạng thái
    const rawSignature =
      `accessKey=${momoConfig.accessKey}` +
      `&orderId=${orderId}` +
      `&partnerCode=${momoConfig.partnerCode}` +
      `&requestId=${requestId}`;

    // Tạo chữ ký HMAC-SHA256 cho yêu cầu kiểm tra trạng thái
    const signature = crypto
      .createHmac("sha256", momoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    // Gửi yêu cầu kiểm tra trạng thái thanh toán
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
    console.log("result", result);

    // Trả về kết quả kiểm tra trạng thái
    return {
      success: result.resultCode === 0, // Kiểm tra nếu kết quả trả về thành công
      transId: result.transId, // Mã giao dịch
      message: result.message, // Thông điệp trả về từ MoMo
    };
  } catch (error) {
    console.error("Error checking payment status:", error); // Ghi lỗi nếu có vấn đề khi kiểm tra
    return { success: false, message: error.message }; // Trả về lỗi nếu không kiểm tra được
  }
};

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
