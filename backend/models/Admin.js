import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully for admin:', this.email);
    next();
  } catch (error) {
    console.error('Password hashing error');
    next(error);
  }
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

export default mongoose.model("Admin", adminSchema);