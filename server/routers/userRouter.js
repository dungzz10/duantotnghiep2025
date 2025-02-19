import express from "express";
import { signup, signin, forgotPassword, resetPassword, getUser, updatePassword, loadUser, logout, signinAdmin } from "../controllers/authControll.js";
import { isAuththenticated, checkquyen } from "../middlewares/auth.js";
import { getOneUser, uppdateMe, deactiveUser } from "../controllers/userControll.js";
const userRouter = express.Router();
// auth router
userRouter.post("/signup", signup);
userRouter.post("/signin", signin)
userRouter.post("/forgotpassword", forgotPassword)
userRouter.post("/resetpassword/:token", resetPassword)
userRouter.put("/uppdatepassword", isAuththenticated, updatePassword)

userRouter.post("/logout", isAuththenticated, logout)

// routee user
userRouter.get("/loaduser", loadUser)
userRouter.get("/", isAuththenticated, checkquyen("admin"), getUser)
userRouter.get("/:userId", isAuththenticated, getOneUser)
userRouter.put("/me", isAuththenticated, uppdateMe)
userRouter.put("/deactive/:userId", isAuththenticated, checkquyen("admin"), deactiveUser)
// router admin
userRouter.post("/admin/signin", signinAdmin)
export default userRouter