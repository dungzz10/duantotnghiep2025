import User from "../models/usersModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
// uppdate user
export const uppdateMe = CatchAsync(async (req, res, next) => {
  // Kiểm tra nếu client cố gắng thay đổi mật khẩu
  if (req.body.password) {
    return next(
      new HandelError("Đường link không hợp lệ, vui lòng thử lại sau", 400)
    );
  }

  // Chỉ cho phép cập nhật email và photo
  const allowedFields = ['email', 'photo'];
  const filetoUppdate = {};

  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      filetoUppdate[field] = req.body[field];
    }
  });

  // Cập nhật người dùng
  const uppdateuser = await User.findByIdAndUpdate(req.user.id, filetoUppdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Cập nhật thành công!",
    user: uppdateuser,
  });
});

// get one user  by id
export const getOneUser = CatchAsync(async (req, res, next) => {
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
