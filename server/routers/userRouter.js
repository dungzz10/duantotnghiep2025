import express from "express";
import { signup, signin, forgotPassword, resetPassword, getUser, updatePassword, loadUser, logout, signinAdmin, logoutAdmin, loadAdmin } from "../controllers/authControll.js";
import { isAuththenticated, checkquyen } from "../middlewares/auth.js";
import { getOneUser, uppdateMe, deactiveUser } from "../controllers/userControll.js";

const userRouter = express.Router();

// auth router
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/resetpassword/:token", resetPassword);
userRouter.put("/uppdatepassword", isAuththenticated, updatePassword);

userRouter.post("/logout", isAuththenticated, logout);

// route user
userRouter.get("/loaduser",isAuththenticated, loadUser);
userRouter.get("/", isAuththenticated, checkquyen("admin"), getUser);
userRouter.get("/:userId", isAuththenticated, getOneUser);
userRouter.put("/me", isAuththenticated, uppdateMe);
userRouter.put("/deactive/:userId", isAuththenticated, checkquyen("admin"), deactiveUser);

// router admin
userRouter.post("/admin/signin", signinAdmin);

// Add logoutAdmin and loadAdmin routes for admin functionalities
userRouter.post("/admin/logout", isAuththenticated,logoutAdmin); // Đăng xuất admin
userRouter.get("/admin/loadadmin",isAuththenticated, loadAdmin);  // Tải thông tin admin

export default userRouter;
