const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "fullname is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be greater than 6 character"],
      select: false,  // Giữ mật khẩu ẩn trong truy vấn mặc định
    },

    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/queentech/image/upload/v1690010294/78695default-profile-picture1_dhkeeb.jpg",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    availableBalance: {
      type: Number,
      default: 0,
    },

    accountBalance: {
      type: Number,
      default: 0,
    },

    withdrawalAccounts: [
      {
        accountName: String,
        accountNumber: String,
        bankName: String,
        swiftCode: String,
      },
    ],

    address: [
      {
        address: String,
        addressType: String,
      },
    ],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,  
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.comparePassword = async function (userPassword, dbPassword) {
  userPassword = String(userPassword);
  console.log(userPassword)
  console.log(dbPassword)
  // Kiểm tra kiểu dữ liệu của các tham số
 console.log(typeof(dbPassword) )
 console.log(typeof(userPassword) )
  return await bcrypt.compare(userPassword, dbPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
