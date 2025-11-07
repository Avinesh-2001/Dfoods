import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "received", "refunded"],
      default: "pending"
    },
    adminNotes: {
      type: String
    },
    refundAmount: {
      type: Number
    }
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", returnSchema);

export default Return;

