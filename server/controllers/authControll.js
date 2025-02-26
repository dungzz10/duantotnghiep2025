import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
import novu from "../utils/novu.js";
import crypto from "crypto";

const sentJwtToken = (userid) => {
  return jwt.sign({ id: userid }, "khoa", { expiresIn: "1h" });
};
const cookieOptions = {
  expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  sammestie: "none",
  secure: true,
};
// Đăng ký người dùng (signup)
export const signup = CatchAsync(async (req, res, next) => {
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

export const signin = CatchAsync(async (req, res, next) => {
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
      return res.status(200).cookie("cookie", token, cookieOptions).json({
        success: true,
        yesUser,
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
export const forgotPassword = CatchAsync(async (req, res, next) => {
  // 1. Lấy email từ body của request
  const { email } = req.body;
  console.log(req.body);
  console.log("Email:", email);

  // 2. Tìm người dùng dựa trên email và đảm bảo truy vấn bao gồm cả trường `password`
  const yesUser = await User.findOne({ email }).select("+password");
  console.log("User found:", yesUser);

  // 3. Nếu không tìm thấy người dùng, trả lỗi
  if (!yesUser) {
    return next(new HandelError("khong tim thay user cua ban (email)", 400));
  }

  // 4. Tạo token đặt lại mật khẩu (reset password token)
  const resetToken = yesUser.getResetPasswordToken();

  // 5. Lưu lại đối tượng người dùng vào cơ sở dữ liệu mà không cần xác thực dữ liệu
  await yesUser.save({ validateBeforeSave: false });

  // 6. Tạo URL reset mật khẩu, bao gồm token trong đường dẫn
  const resetUrl = `localhost:5173/resetpassword/${resetToken}`;

  // 7. Sử dụng thư viện `novu` để gửi email reset mật khẩu
  try {
    await novu.trigger("demo-password-reset", {
      to: {
        subscriberId: yesUser._id, // ID của người nhận
      },
      payload: {
        abc: email, // Đính kèm email làm thông tin thêm nhung khong duoc
        resetPasswordLink: resetUrl, // Link đặt lại mật khẩu
      },
    });
  } catch (error) {
    console.log(error);

    // 8. Nếu email không gửi được, xóa token đặt lại mật khẩu và lưu vào cơ sở dữ liệu
    yesUser.resetPasswordToken = undefined;
    yesUser.resetPasswordExpire = undefined;
    await yesUser.save({ validateBeforeSave: false });

    // 9. Trả lỗi do không gửi được email
    return next(new HandelError("Email loi khi gui", 500));
  }

  // 10. Nếu email gửi thành công, trả phản hồi JSON xác nhận
  res.status(200).json({
    success: true,
    message: `Email sent ${email}`,
  });
});

export const resetPassword = CatchAsync(async (req, res, next) => {
  // 1. Lấy password và confirmpassword từ body của request
  const { password, confirmpassword } = req.body;

  // 2. Lấy token từ tham số trong URL
  const token = req.params.token;

  // 3. Mã hóa token từ request để khớp với giá trị lưu trong cơ sở dữ liệu
  const hashresettoken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 4. Tìm người dùng trong cơ sở dữ liệu dựa trên token mã hóa và kiểm tra thời hạn token
  const user = await User.findOne({
    passwordResetToken: hashresettoken,
    passwordResetExpires: { $gt: Date.now() }, // Chỉ chọn nếu token còn hiệu lực
  });

  // 5. Nếu không tìm thấy người dùng hoặc token hết hạn, trả lỗi
  if (!user) {
    return next(new HandelError("Token het han hoac khong dung", 400));
  }

  // 6. Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp nhau không
  if (password !== confirmpassword) {
    console.log("Password:", password);
    console.log("Confirm Password:", confirmpassword);
    return next(new HandelError("Mat khau khong trung khop", 400));
  } else {
    // 7. Nếu khớp, cập nhật mật khẩu mới cho người dùng
    user.password = password;

    // 8. Xóa token đặt lại mật khẩu và thời hạn từ cơ sở dữ liệu
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 9. Lưu lại các thay đổi của người dùng
    await user.save({ validateBeforeSave: false });

    // 10. Tạo token JWT mới để xác thực sau khi đặt lại mật khẩu thành công
    const jwtToken = sentJwtToken(user._id);

    // 11. Trả phản hồi JSON xác nhận thành công và gửi token JWT
    res.status(200).cookie("cookie", jwtToken, cookieOptions).json({
      success: true,
      token: jwtToken,
      message: "Reset password thanh cong",
    });
  }
});
// upppdate user password
export const updatePassword = CatchAsync(async (req, res, next) => {
  //  Lấy thông tin người dùng từ req.user
  console.log(req.user);
  const userId = req.user.id;

  console.log(userId);
  const user = await User.findById(userId).select("+password");
  console.log(user);
  const { currentPassword, newPassword } = req.body;
  // mật khẩu hiện tại với mật khẩu trong cơ sở dữ liệu
  const isPasscorect = await user.comparePassword(
    currentPassword,
    user.password
  );
  if (!isPasscorect) {
    return next(new HandelError("Mat khau hien tai khong dung", 400));
  }
  // uppdate password
  user.password = newPassword;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  const token = sentJwtToken(user._id);
  res.status(200).cookie("cookie", token, cookieOptions).json({
    success: true,
    token,
  });
});
// load user
export const loadUser = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  res.status(200).json({
    status: "success",
    user,
  });
});
// logout user
export const logout = CatchAsync(async (req, res, next) => {
  res.cookie("cookie", "null", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout thanh cong",
  });
});

//  get all user
export const getUser = CatchAsync(async (req, res, next) => {
  const user = await User.find({ role: "user" }).select("+active");

  res.status(200).json({
    success: true,
    user,
  });
});
export const signinAdmin = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const adminUser = await User.findOne({ email, role: "admin" }).select(
    "+password"
  );
  if (!adminUser) {
    return next(new HandelError("Bạn không có quyền truy cập!", 403));
  }

  const isPasswordValid = await adminUser.comparePassword(
    password,
    adminUser.password
  );
  if (!isPasswordValid) {
    return next(new HandelError("Mật khẩu không đúng", 400));
  }

  const token = sentJwtToken(adminUser._id);
  res.status(200).cookie("cookie", token, cookieOptions).json({
    success: true,
    token,
    message: "Admin đăng nhập thành công!",
  });
});
// Logout Admin
export const logoutAdmin = CatchAsync(async (req, res, next) => {
  res.cookie("cookie", "null", {
    expires: new Date(Date.now() + 10 * 1000), // Set thời gian hết hạn cho cookie
    httpOnly: true, // Chỉ cho phép truy cập cookie từ phía server
  });
  res.status(200).json({
    success: true,
    message: "Admin đã đăng xuất thành công",
  });
});

// Load thông tin Admin hiện tại
export const loadAdmin = CatchAsync(async (req, res, next) => {
  console.log("Load user", req.user);
  const adminId = req.user.id; // Đảm bảo admin đã đăng nhập và có token
  console.log("Admin ID:", adminId);
  const admin = await User.findById(adminId);

  // Kiểm tra nếu không tìm thấy người dùng admin
  if (!admin || admin.role !== "admin") {
    return next(
      new HandelError(
        "Bạn không phải admin hoặc không tìm thấy người dùng!",
        403
      )
    );
  }

  res.status(200).json({
    status: "success",
    admin,
  });
});

export const updateUsertest = CatchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, role, active } = req.body;

  // Find the user by userId
  let user = await User.findById(userId);
  if (!user) {
    return next(new HandelError("User not found", 404));
  }

  if (role) {
    if (!["user", "admin"].includes(role)) {
      return next(new HandelError("Invalid role", 400));
    }
    user.role = role;
  }

  if (active !== undefined) {
    user.active = active;
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
    ded;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});
export const updateUser = CatchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, role, active } = req.body;

  // Tìm người dùng yêu cầu thay đổi
  let user = await User.findById(userId);
  if (!user) {
    return next(new HandelError("User not found", 404));
  }

  // Kiểm tra xem người yêu cầu có phải là superadmin không
  if (req.user.role !== "superadmin") {
    return next(new HandelError("Only superadmin moi co the gan quyen ", 400));
  }

  // Nếu có quyền superadmin, có thể phân quyền admin
  if (role) {
    if (!["user", "admin"].includes(role)) {
      return next(new HandelError("Invalid role", 400));
    }
    user.role = role;
  }

  if (active !== undefined) {
    user.active = active;
  }

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

