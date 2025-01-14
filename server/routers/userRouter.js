const express = require("express");
const { signup, signin,forgotPassword, resetPassword,getUser, updatePassword, loadUser, logout } = require("../controllers/authControll");
const { isAuththenticated,checkquyen } = require("../middlewares/auth");
const { getOneUser, uppdateMe,deactiveUser } = require("../controllers/userControll");
const router = express.Router();
// auth router
router.post("/signup", signup); 
router.post("/signin",signin)
router.post("/forgotpassword",forgotPassword)
router.post("/resetpassword/:token",resetPassword)
router.put("/uppdatepassword",isAuththenticated,updatePassword)
router.post("/loaduser",isAuththenticated,loadUser)
router.post("/logout",isAuththenticated,logout)

// routee user
router.get("/",isAuththenticated ,checkquyen("admin"),getUser)
router.get("/:userId",isAuththenticated,getOneUser)
router.put("/me",isAuththenticated,uppdateMe)
router.put("/deactive/:userId",isAuththenticated,checkquyen("admin"),deactiveUser)



module.exports = router;
