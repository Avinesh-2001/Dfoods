import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get reviews for a specific product (only approved reviews)
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    console.log('📝 Fetching reviews for productId:', productId, 'Type:', typeof productId);
    
    const skip = (page - 1) * limit;
    
    // Only fetch approved reviews for public display
    // Handle both string and ObjectId formats
    let query = {
      isApproved: true
    };
    
    // Try to convert to ObjectId if it's a valid ObjectId string
    if (mongoose.Types.ObjectId.isValid(productId)) {
      query.productId = new mongoose.Types.ObjectId(productId);
      console.log('✅ Using ObjectId format for query');
    } else {
      query.productId = productId;
      console.log('✅ Using string format for query');
    }
    
    // Also try querying with both formats to ensure we find the reviews
    let reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // If no reviews found with ObjectId, try with string
    if (reviews.length === 0 && mongoose.Types.ObjectId.isValid(productId)) {
      console.log('⚠️ No reviews found with ObjectId, trying string format...');
      query.productId = productId;
      reviews = await Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    }

    const total = await Review.countDocuments(query);
    
    // Debug: Check all reviews for this product (approved and unapproved)
    const productIdQuery = mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId;
    const allReviewsForProduct = await Review.find({ productId: productIdQuery });
    const approvedCount = allReviewsForProduct.filter(r => r.isApproved === true).length;
    console.log(`📊 Total reviews for product: ${allReviewsForProduct.length}, Approved: ${approvedCount}, Unapproved: ${allReviewsForProduct.length - approvedCount}`);
    
    // Log all approved reviews to verify they exist
    if (approvedCount > 0 && reviews.length === 0) {
      console.log('⚠️ WARNING: There are approved reviews but query returned 0!');
      console.log('All approved reviews:', allReviewsForProduct.filter(r => r.isApproved).map(r => ({
        id: r._id,
        name: r.name,
        isApproved: r.isApproved,
        productId: r.productId,
        productIdType: typeof r.productId
      })));
    }
    
    console.log(`✅ Returning ${reviews.length} approved reviews for product ${productId}`);
    if (reviews.length > 0) {
      console.log('Reviews data:', reviews.map(r => ({ 
        id: r._id, 
        name: r.name, 
        rating: r.rating,
        isApproved: r.isApproved, 
        productId: r.productId,
        productIdString: String(r.productId)
      })));
    }

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Create a new review (requires admin approval)
router.post('/', async (req, res) => {
  try {
    const { productId, name, rating, text, title, email, images } = req.body;

    // Validate required fields
    if (!productId || !name || !rating || !text) {
      return res.status(400).json({ message: 'Product ID, name, rating, and text are required' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate images size (if provided)
    if (images && Array.isArray(images)) {
      // Limit to 3 images
      if (images.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 images allowed' });
      }
      
      // Check each image size (base64 length)
      for (const img of images) {
        if (img && img.length > 700000) { // ~500KB limit
          return res.status(400).json({ 
            message: 'Images too large. Please compress images to under 500KB each' 
          });
        }
      }
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create new review with isApproved: false (requires admin approval)
    const newReview = new Review({
      productId,
      name,
      email: email || undefined,
      title: title || undefined,
      rating,
      text,
      images: images && Array.isArray(images) ? images : (images ? [images] : []), // Ensure images is an array
      isApproved: false, // Requires admin approval
      isVerified: false
    });

    await newReview.save();

    console.log(`✅ Review created with ${newReview.images?.length || 0} images`);

    res.status(201).json({
      message: 'Review submitted successfully and is pending admin approval',
      review: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// Get all reviews (for admin dashboard)
router.get('/admin/all', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    
    const skip = (page - 1) * limit;
    let filter = {};
    
    // Filter by approval status
    if (status === 'pending') {
      filter.isApproved = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    }
    // If status === 'all', no filter is applied
    
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Update review approval status (admin only)
router.put('/admin/:reviewId/approve', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// Delete review (admin only)
router.delete('/admin/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

export default router;