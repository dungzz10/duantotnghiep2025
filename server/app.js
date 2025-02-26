import RouterContact from "./routers/contact.js";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import RouterCategory from "./routers/category.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import HandelError from "./utils/Error.js";
import globalMillwareError from "./controllers/errorControll.js";
import RouterBranch from "./routers/branch.js";
import RouterAccessory from "./routers/accessory.js";
import RouterBanner from "./routers/bannerRouter.js";
import RouterReview from "./routers/reviewsRouter.js";
import momoPaymentRoutes from "./routers/momoPayment.js";

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
app.use("/api/momo", momoPaymentRoutes);

app.get("/test", (req, res) => {
  res.status(200).send("Hello, welcome to Brokang Market");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/contact", RouterContact);
app.use("/api/v1/categories", RouterCategory);
app.use("/api/v1/branch", RouterBranch);
app.use("/api/v1/accessory", RouterAccessory);
app.use("/api/v1/banners", RouterBanner);
app.use("/api/v1/reviews", RouterReview);



app.all("*", (req, res, next) => {
  next(new HandelError(`Đường dẫn của bạn bị lỗi ${req.originalUrl}`, 400));
});
app.use(globalMillwareError);
export default app;

