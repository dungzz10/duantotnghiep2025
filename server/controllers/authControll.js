const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const CatchAsync = require("../utils/CatchAsync");
const HandelError = require("../utils/Error");

exports.signup = CatchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.create({ email, password, name });
  res.status(200).json({ success: true, message: "Signup successful!", user });
});
exports.signin = CatchAsync(async (req, res,next) => {
  const { email, password } = req.body;

  const yesUser = await User.findOne({ email }).select("+password");
  console.log("User found:", yesUser);

  if (!yesUser) {
   return next(new HandelError("khong tim thay user cua ban (email)",400))
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
      return next( new HandelError("mat khau khong dung vui long nhap lai"),400)
    }
  }
});
