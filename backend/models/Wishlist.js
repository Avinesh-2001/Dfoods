import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
