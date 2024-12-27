const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const CatchAsync = require("../utils/CatchAsync");
const HandelError = require("../utils/Error");
const novu = require("../utils/novu");


// Đăng ký người dùng (signup)
exports.signup = CatchAsync(async (req, res,next) => {
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
      const token = jwt.sign(
        { id: yesUser._id },
        process.env.JWT_SECRET || "khoa",
        { expiresIn: "1h" }
      );
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
