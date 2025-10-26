import mongoose from 'mongoose';
import slugify from 'slugify'; // Install if needed: npm i slugify

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  ingredients: [{ type: String }],
  productInfo: { type: String },
  variants: [{ 
    size: { type: String }, 
    price: { type: Number } 
  }], // e.g., [{size: "250g", price: 80}, {size: "500g", price: 140}]
  tags: [{ type: String }],
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String, required: true }],
  quantity: { type: Number, default: 0 },
  status: { type: String, enum: ['in-stock', 'out-of-stock', 'limited'], default: 'out-of-stock' },
  createdAt: { type: Date, default: Date.now },
});

// Generate slug from name before save
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// Virtual for inStock (computed from quantity)
productSchema.virtual('inStock').get(function () {
  return this.quantity > 0;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;