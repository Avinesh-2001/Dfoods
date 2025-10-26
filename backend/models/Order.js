import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      phone: String
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing"
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
