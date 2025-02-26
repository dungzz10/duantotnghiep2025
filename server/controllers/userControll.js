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
      _id: { $ne: req.user.id }
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

  // Sửa lại phần select để tránh xung đột giữa inclusion và exclusion
  const user = await User.findById(userId)
    .select(
      "name email photo role introduction createdAt wallet address withdrawalAccounts"
    )
    .lean();

  if (!user) {
    return next(new HandelError("Không tìm thấy thông tin khách hàng", 404));
  }

  // Tính tổng số tiền đã nạp thành công
  const totalDeposits = user.wallet.transactions
    .filter((t) => t.status === "completed" && t.type === "momo_payment")
    .reduce((sum, t) => sum + t.amount, 0);

  // Xử lý danh sách giao dịch để hiển thị tiếng Việt
  const transactions = user.wallet.transactions.map((t) => ({
    ...t,
    trangThai: {
      pending: "Đang xử lý",
      completed: "Thành công",
      failed: "Thất bại",
    }[t.status],
    loaiGiaoDich: {
      momo_payment: "Nạp tiền MoMo",
      deposit: "Nạp tiền",
      withdrawal: "Rút tiền",
    }[t.type],
  }));

  // Sắp xếp giao dịch mới nhất lên đầu
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({
    success: true,
    data: {
      thongTinKhachHang: {
        hoTen: user.name,
        email: user.email,
        anhDaiDien: user.photo,
        vaiTro: user.role,
        gioiThieu: user.introduction,
        ngayTao: user.createdAt,
      },
      thongTinVi: {
        soDu: user.wallet.balance,
        tongTienNap: totalDeposits,
        tongGiaoDich: transactions.length,
      },
      lichSuGiaoDich: transactions.map((t) => ({
        maGiaoDich: t.momoTransactionId,
        loaiGiaoDich: t.loaiGiaoDich,
        soTien: t.amount,
        trangThai: t.trangThai,
        moTa: t.description,
        thoiGian: t.date,
      })),
      diaChiGiaoHang:
        user.address?.map((a) => ({
          diaChi: a.address,
        })) || [],
    },
  });
});
