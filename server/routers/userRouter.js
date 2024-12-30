const express = require("express");
const { signup, signin,forgotPassword, resetPassword } = require("../controllers/authControll");

const router = express.Router();

router.post("/signup", signup); 
router.post("/signin",signin)
router.post("/forgotpassword",forgotPassword)
router.post("/resetpassword/:token",resetPassword)

module.exports = router;
