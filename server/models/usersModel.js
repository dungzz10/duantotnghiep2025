import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// import CatchAsync from "../utils/CatchAsync";

const userSchema = new mongoose.Schema(
  {
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

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
      select: false, // Giữ mật khẩu ẩn trong truy vấn mặc định
    },

    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/queentech/image/upload/v1690010294/78695default-profile-picture1_dhkeeb.jpg",
    },
    introduction: String,
    numProducts: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    superadmin: {
      type: Boolean,
      default: false,
    },
    orderHistory: {
      //  bảng order sẽ ở đây
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Order",
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        image: String,
        color: String,
        size: Number,
        price: Number,
        quantity: Number,
        brand: String,
      },
    ],
    phoneNumber: {
      type: Number,
    },

    withdrawalAccounts: [
      {
        accountName: String,
        accountNumber: String,
        bankName: String,
        swiftCode: String,
      },
    ],
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          type: {
            type: String,
            enum: [
              "momo_naptien",
              "deposit",
              "withdraw",
              "transfer",
              "muahang",
              "momo_payment",
            ], // Update enum to include new type
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          momoTransactionId: String,
          status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
          },
          date: {
            type: Date,
            default: Date.now,
          },
          description: String,
        },
      ],
    },
    // ATM
    ATM: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          type: {
            type: String,
            enum: ["momo_naptien", "deposit", "withdrawal", "muahang"],
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          momoTransactionId: String,
          status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
          },
          date: {
            type: Date,
            default: Date.now,
          },
          description: String,
        },
      ],
    },

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
// thay doi truong passwordChangedAt khi thay doi password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});
// Middleware pre("find") của Mongoose sẽ được kích hoạt trước khi một truy vấn find được thực thi
//  regex  /^find/ ap dung voi tat ca find findone ..v ..v
userSchema.pre(/^find/, function (next) {
  // this.find({ active: true });
  next();
});

userSchema.methods.comparePassword = async function (userPassword, dbPassword) {
  userPassword = String(userPassword);
  console.log(userPassword);
  console.log(dbPassword);
  // Kiểm tra kiểu dữ liệu của các tham số
  console.log(typeof dbPassword);
  console.log(typeof userPassword);
  return await bcrypt.compare(userPassword, dbPassword);
};
userSchema.methods.getResetPasswordToken = function () {
  // Tạo token reset password
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken);

  // Mã hóa token reset password
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(this.passwordResetToken);
  // Thời gian hết hạn của token reset password
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút

  return resetToken;
};
// Kiểm tra xem mật khẩu có bị thay đổi sau khi token được cấp phát hay không
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

    return JWTTimestamp < changedTimestamp;
  }

  // pass khong bi thay doi
  return false;
};

export default mongoose.model("User", userSchema);
