import mongoose from "mongoose";

// Định nghĩa schema
const accessorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "ten phu kien kien"],
      maxLength: [40, "ten phu kien kien khong duoc qua 40 ki tu"],
      minlength: [5, "ten phu kien kien phai lon hon 5 ki tu"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "phu kien kien can co mo ta"],
      maxLength: [200, "mo ta phu kien kien khong duoc qua 200 ki tu"],
    },
    originalPrice: {
      type: Number,
      required: [true, "phu kien kien can co gia"],
      maxLength: [7, "gia phu kien kien khong duoc qua 7 chu so"],
    },
    salePrice: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      required: [true, "phu kien kien can co gia van chuyen"],
    },
    image: [
      {
        id: {
          type: String,
        },
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    tag: [String],

    variants: [
      {
        color: {
          type: String,
          required: [true, "Biến thể phải có màu sắc"],
        },
        size: {
          type: String,
          required: [true, "Biến thể phải có kích thước"],
        },
        price: {
          type: Number,
          required: [true, "Biến thể phải có giá"],
        },
        quantity: {
          type: Number,
          required: [true, "Biến thể phải có số lượng"],
          min: [0, "Số lượng phải lớn hơn hoặc bằng 0"],
        },
        image: {
          type: String,
        },
      },
    ],
    condition: {
      type: String,
      enum: {
        values: ["new", "used", "semiused"],
        message: "condition has to be new , used, semiused",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["sale", "under reservation", "sold out", "hide"],
        message: "status is incorrect",
      },
      default: "sale",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "rating thap nhat 1"],
      max: [5, "rating cao nhat 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("accessory", accessorySchema);
