const express = require("express");
const { signup, signin,forgotPassword, resetPassword,getUser, updatePassword, loadUser, logout } = require("../controllers/authControll");
const { isAuththenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/signup", signup); 
router.post("/signin",signin)
router.post("/forgotpassword",forgotPassword)
router.post("/resetpassword/:token",resetPassword)
router.put("/uppdatepassword",isAuththenticated,updatePassword)
router.post("/loaduser",isAuththenticated,loadUser)
router.post("/logout",isAuththenticated,logout)
router.get("/",isAuththenticated ,getUser)


module.exports = router;
