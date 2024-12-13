const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./router/userRouter");
const HandelError = require("./utils/Error");
const globalMillwareError = require("./controllers/errorControll")

dotenv.config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",  
  })
);

app.use(cookieParser());  
app.use(express.json()); 
app.use(express.urlencoded({ extended: true, limit: "50mb" }));  


app.get("/test", (req, res) => {
  res.status(200).send("Hello, welcome to Brokang Market");
});


app.use("/api/v1/user", userRouter);
app.all("*",(req,res,next)=>{
  next(
    new HandelError(
      `duong dan cua ban bi loi ${req.originalUrl}`,400
    )
  )
})
app.use(globalMillwareError)
module.exports = app
