import express from "express";
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  getUser,
  updatePassword,
  loadUser,
  logout,
  signinAdmin,
  logoutAdmin,
  loadAdmin,
  updateUser,
  getAdminUsers,
} from "../controllers/authControll.js";
import { isAuththenticated, checkquyen } from "../middlewares/auth.js";
import {
  getOneUser,
  uppdateMe,
  deactiveUser,
  getCustomerDetails,
  addUserAdmin,
  deactivateUserAdmin,
  updateUserAdmin,
} from "../controllers/userControll.js";
import {
  createMomoPayment,
  verifyTransaction,
  getWalletBalance,
  createWalletDeposit,
} from "../controllers/paymentController.js";

const userRouter = express.Router();

// auth router
userRouter.get("/admin/", isAuththenticated, getAdminUsers);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword/:token", resetPassword);
userRouter.put("/uppdatepassword", isAuththenticated, updatePassword);

userRouter.post("/logout", isAuththenticated, logout);

// route user
userRouter.post("/uppdate/:userId", isAuththenticated, updateUser);
userRouter.get("/loaduser", isAuththenticated, loadUser);
userRouter.get("/", isAuththenticated, getUser);
userRouter.get("/:userId", isAuththenticated, getOneUser);
userRouter.put("/me", isAuththenticated, uppdateMe);
userRouter.put(
  "/deactive/:userId",
  isAuththenticated,

  deactiveUser
);

// router admin
userRouter.post("/admin/signin", signinAdmin);

// Add logoutAdmin and loadAdmin routes for admin
userRouter.post("/admin/logout", isAuththenticated, logoutAdmin);
userRouter.get("/admin/loadadmin", isAuththenticated, loadAdmin);

userRouter.post("/admin/signup", isAuththenticated, addUserAdmin);
userRouter.put(
  "/admin/deactive/:userId",
  isAuththenticated,
  deactivateUserAdmin
);
userRouter.put("/admin/uppdate/:userId", isAuththenticated, updateUserAdmin);

// Group MoMo payment routes
userRouter.post(
  "/payment/wallet/deposit",
  isAuththenticated,
  createWalletDeposit
);
userRouter.get("/wallet/balance", isAuththenticated, getWalletBalance);

userRouter.get(
  "/payment/verify/:orderId",
  isAuththenticated,
  verifyTransaction
);

userRouter.get("/khachhang/:userId", isAuththenticated, getCustomerDetails);

export default userRouter;
