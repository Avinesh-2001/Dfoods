'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/api';
import {
  StarIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Review {
  _id: string;
  productId: string;
  productName?: string;
  name: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    try {
      const response = await adminApi.getAllReviews({ status: filterStatus });
      const reviewsData = response.data.reviews || [];
      
      // Fetch product names for each review
      const reviewsWithProductNames = await Promise.all(
        reviewsData.map(async (review: Review) => {
          try {
            const productResponse = await adminApi.getProductById(review.productId);
            return {
              ...review,
              productName: productResponse.data.name || 'Unknown Product'
            };
          } catch (error) {
            return {
              ...review,
              productName: 'Product Not Found'
            };
          }
        })
      );
      
      setReviews(reviewsWithProductNames);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Mock data for demonstration
      setReviews([
        {
          _id: '1',
          productId: '1',
          productName: 'Organic Jaggery',
          name: 'Priya Sharma',
          rating: 5,
          text: 'Excellent quality jaggery! Very authentic taste and good packaging.',
          isApproved: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          productId: '2',
          productName: 'Coconut Jaggery',
          name: 'Rajesh Kumar',
          rating: 4,
          text: 'Good product, authentic flavor. Delivery was fast.',
          isApproved: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await adminApi.approveReview(reviewId, true);
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, isApproved: true } : review
      ));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await adminApi.approveReview(reviewId, false);
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, isApproved: false } : review
      ));
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await adminApi.deleteReview(reviewId);
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && review.isApproved) ||
                         (filterStatus === 'pending' && !review.isApproved);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-600">Manage customer reviews and ratings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{review.name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    review.isApproved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Product: </span>
                  <span className="text-sm font-medium text-blue-600">{review.productName || 'Unknown Product'}</span>
                </div>
                <p className="text-gray-700 mb-3">{review.text}</p>
                <div className="text-sm text-gray-500">
                  Product ID: {review.productId} • {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!review.isApproved && (
                  <button
                    onClick={() => handleApprove(review._id)}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                )}
                {review.isApproved && (
                  <button
                    onClick={() => handleReject(review._id)}
                    className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No reviews found</div>
        </div>
      )}
    </div>
  );
}
