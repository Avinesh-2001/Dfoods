import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    minPurchaseAmount: {
      type: Number,
      default: 0
    },
    maxDiscountAmount: {
      type: Number, // For percentage discounts
      default: null
    },
    usageLimit: {
      type: Number,
      default: null // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicableCategories: [{
      type: String
    }],
    excludedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],
    usedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      usedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(subtotal) {
  if (subtotal < this.minPurchaseAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === "percentage") {
    discount = (subtotal * this.discountValue) / 100;
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }

  return Math.min(discount, subtotal);
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;

