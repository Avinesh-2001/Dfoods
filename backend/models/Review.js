import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);