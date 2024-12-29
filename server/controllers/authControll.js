const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const CatchAsync = require("../utils/CatchAsync");
const HandelError = require("../utils/Error");
const novu = require("../utils/novu");
const crypto = require("crypto");

const sentJwtToken = (userid) => {
  return jwt.sign({ id: userid }, "khoa", { expiresIn: "1h" });

}
// Đăng ký người dùng (signup)
exports.signup = CatchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;

  // Kiểm tra nếu người dùng đã tồn tại
  let user = await User.findOne({ email });
  if (user) {
    return next(new HandelError("User already exists", 400));
  }

  // Tạo người dùng trực tiếp, bỏ qua bước active
  user = await User.create({ email, password, name });

  // Tạo subscriber trong Novu
  await novu.subscribers.identify(user._id, {
    firstName: name,
    email,
  });

  // Gửi thông báo (nếu cần)
  await novu.trigger("demo-recent-login", {
    to: {
      subscriberId: user._id, // Sử dụng ID của người dùng làm subscriberId
    },
    payload: {
      userName: name,
      companyName: "dungdq03",
    },
  });

  res.status(201).json({
    success: true,
    message: "Signup successful!",
    user,
  });
});

exports.signin = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const yesUser = await User.findOne({ email }).select("+password");
  console.log("User found:", yesUser);

  if (!yesUser) {
    return next(new HandelError("khong tim thay user cua ban (email)", 400));
  } else {
    const comparePass = await yesUser.comparePassword(
      password,
      yesUser.password
    );
    console.log("Password comparison result:", comparePass);

    if (comparePass) {
      const token = sentJwtToken(yesUser._id);
      return res.status(200).json({
        success: true,
        token,
      });
    } else {
      return next(
        new HandelError("mat khau khong dung vui long nhap lai"),
        400
      );
    }
  }
});
exports.forgotPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;
  const yesUser = await User.findOne({ email }).select("+password");
  console.log("User found:", yesUser);

  if (!yesUser) {
    return next(new HandelError("khong tim thay user cua ban (email)", 400));
  }
  const resetToken = yesUser.getResetPasswordToken();
  // Lưu lại đối tượng người dùng (yesUser) vào cơ sở dữ liệu sau khi cập nhật các trường (như token reset).
  await yesUser.save({ validateBeforeSave: false });
  // Gửi email reset password
  const resetUrl = `localhost:3000/resetpassword/${resetToken}`;
  try {
    await novu.trigger("demo-password-reset", {
      to: {
        subscriberId: yesUser._id,
      },
      payload: {
        abc: email,
        resetPasswordLink: resetUrl,
      },
    });
  } catch (error) {
    console.log(error);
    yesUser.resetPasswordToken = undefined;
    yesUser.resetPasswordExpire = undefined;
    await yesUser.save({ validateBeforeSave: false });
    return next(new HandelError("Email loi khi gui", 500));
  }
  res.status(200).json({
    success: true,
    message: `Email sent ${email}`,
  });
});
exports.resetPassword = CatchAsync(async (req, res, next) => {
  const { password, confirmpassword } = req.body;
  const token = req.params.token;
  const hashresettoken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Tìm người dùng với token
  const user = await User.findOne({
    passwordResetToken: hashresettoken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new HandelError("Token het han hoac khong dung", 400));
  }
  if (password !== confirmpassword) {
    return next(new HandelError("Mat khau khong trung khop", 400));
  }else{
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    const jwtToken = sentJwtToken(user._id);
    res.status(200).json({
      success: true,
      token: jwtToken,
      message: "Reset password thanh cong",
    });
  }
});
