const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/datn2025";
// Xử lý các ngoại lệ chưa được bat
process.on("uncaughtException", (err) => {
  console.log("Lỗi = ", +err.message); // In ra thông điệp loi
  console.log("Đang đóng ứng dụng do có ngoại lệ chưa được bắt");
});
// Kết nối MongoDB 
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Kết nối MongoDB thành công!");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error);
  });

const server = app.listen(port, () => {
  console.log("Our app is running on PORT " + port);
});

process.on("unhandledRejection", (err) => {
  console.log(`${err.name} ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});
