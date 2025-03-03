import mongoose from "mongoose";

// Định nghĩa schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "san pham can co ten"],
      maxLength: [40, "ten san pham khong duoc qua 40 ki tu"],
      minlength: [5, "ten san pham phai lon hon 5 ki tu"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      required: [true, "san pham can co ten"],
      maxLength: [40, "ten san pham khong duoc qua 40 ki tu"],
    },
    description: {
      type: String,
      required: [true, "san pham can co mo ta"],
      maxLength: [200, "mo ta san pham khong duoc qua 200 ki tu"],
    },
    originalPrice: {
      type: Number,
      required: [true, "san pham can co gia"],
      maxLength: [7, "gia san pham khong duoc qua 7 chu so"],
    },
    salePrice: {
      type: Number,
    },
    shippingFee: {
      type: Number,
    },
    image: [
      {
        url: String,
        public_id: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    tag: [String],
    // Biến thể sản phẩm: mỗi màu có giá và số lượng riêng cho từng kích thước
    variants: [
      {
        color: {
          type: String,
          required: [true, "Biến thể phải có màu sắc"],
        },
        sizes: [
          {
            size: { type: String, required: true },
            quantity: { type: Number, required: true, min: 0 },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    condition: {
      type: String,
      enum: {
        values: ["new", "used", "semiused", "limited edition"],
      },
    },
    status: {
      type: String,
      enum: {
        values: ["sale", "sold out", "new"],
        message: "Trạng thái không hợp lệ",
      },
      default: "new",
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
    salePrice: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          if (value === 0) return true;

          const discountPercentage =
            ((this.originalPrice - value) / this.originalPrice) * 100;

          return discountPercentage >= 0 && discountPercentage <= 50;
        },
        message: "Giá khuyến mãi phải từ 0% đến 50% giá gốc",
      },
    },
    // warehouseStock: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.salePrice && this.salePrice > 0) {
    this.status = "sale";
  } else {
    this.status = "new";
  }

  const allSoldOut = this.variants.every((variant) =>
    variant.sizes.every((size) => size.quantity === 0)
  );

  if (allSoldOut) {
    this.status = "sold out";
  }

  next();
});

export default mongoose.model("Product", productSchema);
