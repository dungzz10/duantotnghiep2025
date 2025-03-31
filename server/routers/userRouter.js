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
  googleLogin,
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
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/userControll.js";
import {
  createMomoPayment,
  verifyTransaction,
  getWalletBalance,
  createWalletDeposit,
  withdrawFromWallet,
} from "../controllers/paymentController.js";

const userRouter = express.Router();

// auth router

userRouter.get("/khachhang/:userId", isAuththenticated, getCustomerDetails);
userRouter.get("/my-addresses",isAuththenticated, getMyAddresses);
userRouter.get("/admin/", isAuththenticated, getAdminUsers);
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/google-login", googleLogin);


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
userRouter.post(
  "/payment/wallet/withdraw",
  isAuththenticated,
  withdrawFromWallet
);
userRouter.get("/wallet/balance", isAuththenticated, getWalletBalance);

userRouter.get(
  "/payment/verify/:orderId",
  isAuththenticated,
  verifyTransaction
);
// adress

userRouter.post("/add-address",isAuththenticated, addAddress);
userRouter.put("/update-address",isAuththenticated, updateAddress);
userRouter.delete("/delete-address/:addressId", isAuththenticated, deleteAddress);



export default userRouter;
