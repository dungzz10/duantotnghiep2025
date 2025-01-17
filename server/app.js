const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter")
const HandelError = require("./utils/Error");
const globalMillwareError = require("./controllers/errorControll");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Cho phép frontend từ cổng 5173
    credentials: true, // Nếu cần gửi cookies hoặc token
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/test", (req, res) => {
  res.status(200).send("Hello, welcome to Brokang Market");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.all("*", (req, res, next) => {
  next(new HandelError(`duong dan cua ban bi loi ${req.originalUrl}`, 400));
});
app.use(globalMillwareError);
module.exports = app;
