import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Vui lòng nhập mã voucher"],
    unique: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: [true, "Vui lòng chọn loại voucher"],
  },
  value: {
    type: Number,
    required: [true, "Vui lòng nhập giá trị voucher"],
    min: [0, "Giá trị voucher không được âm"]
  },
  maxDiscount: {
    type: Number,
    required: function() {
      return this.type === "percentage";
    }
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, "Vui lòng chọn ngày bắt đầu"]
  },
  endDate: {
    type: Date,
    required: [true, "Vui lòng chọn ngày kết thúc"]
  },
  quantity: {
    type: Number,
    required: [true, "Vui lòng nhập số lượng voucher"],
    min: [0, "Số lượng không được âm"]
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: String,
  conditions: {
    userType: {
      type: String,
      enum: ["all", "new", "existing"],
      default: "all"
    },
    productCategories: [{
      type: String
    }],
    userUsageLimit: {
      type: Number,
      default: 1
    }
  },
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: Date,
    orderId: String
  }]
}, {
  timestamps: true
});

const Voucher = mongoose.model("Voucher", voucherSchema);
export default Voucher;