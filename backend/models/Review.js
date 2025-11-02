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
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },
  email: {
    type: String,
    trim: true
  },
  images: [{
    type: String // Array of image URLs or base64 data URLs
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model('Review', reviewSchema);