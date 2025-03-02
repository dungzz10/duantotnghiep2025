import User from "../models/usersModel.js";
import HandelError from "../utils/Error.js";
import CatchAsync from "../utils/CatchAsync.js";
import jwt from "jsonwebtoken";
export const isAuththenticated = CatchAsync(async (req, res, next) => {
  // Lấy token từ req.cookies: dua tren ten cookie da dat
  const { cookie } = req.cookies;
  // console.log(cookie )
  if (!cookie) {
    return next(
      new HandelError("Bạn phải đăng nhập để thực hiện hành động này", 400)
    );
  }

  // Giải mã token nếu có:
  const decoded = jwt.verify(cookie, "khoa");
  // console.log(decoded)
  // Tìm người dùng dựa trên token đã giải mã:
  // Đây là thời gian token được tạo(iat) (Issued At Time).
  // thời gian hết hạn của token (Expiration Time).

  // decoded { id: '676eba983d3a8217bc99938f', iat: 1736764357, exp: 1736767957 }
  const user = await User.findById(decoded.id);
  // console.log(user, 1234567);
  if (!user) {
    return next(new HandelError("User khong ton tai ", 404));
  }

  // Kiểm tra xem mật khẩu có bị thay đổi sau khi token được cấp phát hay không:
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new HandelError(
        "Mật khẩu của bạn đã thay đổi. Vui lòng đăng nhập lại",
        401
      )
    );
  }
  // console.log(1)
  // Gán thông tin người dùng vào đối tượng request:
  // console.log(user)
  // gan user vao req.user

  req.user = user;

  next();
});
export const checkquyen = (...roles) => {
  // console.log(roles)
  return (req, res, next) => {
    // console.log(1)
    // console.log(req.user.id)
    if (!roles.includes(req.user.role)) {
      return next(
        new HandelError("Bạn không có quyền thực hiện hành động này", 403)
      );
    }
    next();
  };
};
