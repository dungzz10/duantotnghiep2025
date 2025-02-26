import User from "../models/usersModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
// uppdate user
export const uppdateMe = CatchAsync(async (req, res, next) => {
  // Kiểm tra nếu client cố gắng thay đổi mật khẩu
  if (req.body.password) {
    return next(
      new HandelError("Vui lòng sử dụng API đổi mật khẩu riêng", 400)
    );
  }

  // Kiểm tra email trùng một cách chặt chẽ hơn
  if (req.body.email) {
    const emailExists = await User.findOne({
      email: req.body.email.toLowerCase(), // Chuyển email về lowercase
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      return next(
        new HandelError("Email này đã được sử dụng bởi tài khoản khác", 400)
      );
    }
  }

  // Kiểm tra tên nếu được cập nhật
  if (req.body.name) {
    if (req.body.name.length < 2 || req.body.name.length > 50) {
      return next(new HandelError("Tên phải từ 2 đến 50 ký tự", 400));
    }
  }

  // Cho phép cập nhật các trường này
  const allowedFields = ["name", "email", "photo", "address", "introduction"];
  const updateData = {};

  // Lọc và xử lý các trường được phép cập nhật
  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      // Với email, luôn chuyển về lowercase
      if (field === "email") {
        updateData[field] = req.body[field].toLowerCase();
      } else {
        updateData[field] = req.body[field];
      }
    }
  });

  // Cập nhật thông tin người dùng với validation
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật thông tin thành công!",
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      introduction: updatedUser.introduction,
      address: updatedUser.address,
    },
  });
});

// get one user  by id
export const getOneUser = CatchAsync(async (req, res, next) => {
  console.log("abd", req.params.userId);
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new HandelError("khong tim thay user cua ban", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// deaxtive user
export const deactiveUser = CatchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  console.log("Deactivating user with ID:", userId);

  // Cập nhật trạng thái của người dùng
  const user = await User.findByIdAndUpdate(
    userId,
    { active: false },
    { new: true, runValidators: true }
  );

  // Nếu không tìm thấy người dùng, trả lỗi
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng với ID này", 404));
  }

  // Trả phản hồi thành công
  res.status(200).json({
    success: true,
    message: "Người dùng đã bị vô hiệu hóa",
    user,
  });
});

export const getCustomerDetails = CatchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId)
    .select(
      "name email photo role introduction createdAt wallet address withdrawalAccounts"
    )
    .lean();

  if (!user) {
    return next(new HandelError("Không tìm thấy thông tin khách hàng", 404));
  }

  // const totalDeposits = user.wallet.transactions
  //   .filter((t) => t.status === "completed" && t.type === "momo_naptien")
  //   .reduce((sum, t) => sum + t.amount, 0);

  const transactions = user.wallet.transactions.map((t) => ({
    ...t,
    status: {
      pending: "Đang xử lý",
      completed: "Thành công",
      failed: "Thất bại",
    }[t.status],
    type: {
      momo_naptien: "Nạp tiền MoMo",
      deposit: "Nạp tiền",
      muahang: "Mua hàng",
    }[t.type],
  }));

  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      introduction: user.introduction,
      createdAt: user.createdAt,
      wallet: {
        balance: user.wallet.balance,
        // totalDeposits: totalDeposits,
        transactionCount: transactions.length,
        transactions: transactions.map((t) => ({
          type: t.type,
          amount: t.amount,
          momoTransactionId: t.momoTransactionId,
          status: t.status,
          description: t.description,
          date: t.date,
        })),
      },
      address:
        user.address?.map((a) => ({
          address: a.address,
          addressType: a.addressType,
        })) || [],
      withdrawalAccounts: user.withdrawalAccounts || [],
    },
  });
});
