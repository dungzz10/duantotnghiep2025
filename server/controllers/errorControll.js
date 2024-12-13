const HandelError = require("../utils/Error");
module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || "error");

  // 1. Xử lý lỗi CastError (lỗi định dạng đối tượng ID)
  if (err.name === "CastError") {
    const castMessage = `Tham số không hợp lệ: ${err.path}: ${err.value}`;
    err = new HandelError(castMessage, 400);
  }

  // 2. Xử lý lỗi xác thực (ValidationError)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((el) => el.message);
    const validationMsg = `Dữ liệu đầu vào không hợp lệ ${messages.join(".")}`;
    err = new HandelError(validationMsg, 400);
  }

  // 3. Xử lý lỗi trùng dữ liệu (duplicate data error)
  if (err.code === 11000) {
    const regex = /\{([^}]*)\}/;
    const match = err.message.match(regex);

    let str = "";

    if (match && match.length > 1) {
      str = match[1];
    } else {
      str = "Một trường dữ liệu";
    }

    const dublicateMsg = `${str} đã tồn tại. Vui lòng thử giá trị khác.`;

    err = new HandelError(dublicateMsg, 400);
  }

  // 4. Xử lý lỗi JWT không hợp lệ
  if (err.name === "JsonWebTokenError") {
    const jwtMsg = `URL của bạn không hợp lệ, vui lòng thử lại sau`;
    err = new HandelError(jwtMsg, 400);
  }
  // 5. handle expired jwt error
	if (err.name === "TokenExpiredError") {
		const jwtMsg = `Your url has expired try again latter`
		err = new HandelError(jwtMsg, 400)
	}

  if (process.env.NODE_ENV || "production" === "production") {
    // Lỗi khi ở chế độ phát triển (development)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    // Lỗi khi ở chế độ sản xuất (production)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
};
