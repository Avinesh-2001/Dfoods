'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { useSelector } from 'react-redux';
import { MinusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { HeartIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ui/ProductCard';
import { adminApi } from '@/lib/api/api';
import { products as mockProducts } from '@/lib/data/products';
import { useWishlistStore } from '@/lib/store/wishlistStore';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const user = useSelector((state: any) => state.user?.user);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isProductInWishlist = useWishlistStore((state) => state.isInWishlist);
  const wishlistInitialized = useWishlistStore((state) => state.initialized);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Description: false,
    Ingredients: false,
    Benefits: false,
    'Storage Info': false,
    FAQ: false,
    FAQ1: false,
    FAQ2: false,
    FAQ3: false,
    Reviews: false,
  });
  const [offersExpanded, setOffersExpanded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewSort, setReviewSort] = useState('mostRecent');
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (!wishlistInitialized) {
      fetchWishlist();
    }
  }, [wishlistInitialized, fetchWishlist]);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Function to fetch reviews separately so we can refresh them
  const fetchReviews = async (productId: string) => {
    try {
      console.log('🔄 Fetching reviews for product:', productId);
      const reviewsResponse = await adminApi.getProductReviews(productId);
      console.log('📦 Reviews API Response:', reviewsResponse);
      
      const reviewsData = reviewsResponse.data?.reviews || reviewsResponse.data || [];
      console.log('📝 Parsed reviews data:', reviewsData);
      console.log('📊 Number of reviews:', reviewsData.length);
      
      // Always set reviews array (empty or with data)
      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
        console.log('✅ Reviews set successfully:', reviewsData.length);
        if (reviewsData.length > 0) {
          console.log('📋 Review details:', reviewsData.map((r: any) => ({ name: r.name, rating: r.rating, isApproved: r.isApproved })));
        }
      } else {
        console.warn('⚠️ Reviews data is not an array:', reviewsData);
        setReviews([]);
      }
    } catch (reviewError: any) {
      console.error('❌ Error fetching reviews:', reviewError);
      console.error('Error details:', reviewError.response?.data || reviewError.message);
      setReviews([]);
    }
  };

  // Helper function to get image URL with fallback
  const getImageUrl = (imageUrl: string | undefined, index: number = 0): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return 'https://via.placeholder.com/500x500?text=No+Image';
    }
    // If image failed before, use placeholder
    if (failedImages.has(index)) {
      return 'https://via.placeholder.com/500x500?text=Image+Error';
    }
    // Validate URL format
    try {
      new URL(imageUrl);
      return imageUrl;
    } catch {
      // If not a valid URL, treat as relative or return placeholder
      if (imageUrl.startsWith('/') || imageUrl.startsWith('http')) {
        return imageUrl;
      }
      return 'https://via.placeholder.com/500x500?text=Invalid+URL';
    }
  };

  // Handle image load errors
  const handleImageError = (index: number, imageUrl: string) => {
    console.warn(`Image failed to load at index ${index}:`, imageUrl);
    setFailedImages(prev => new Set(prev).add(index));
    setImageErrors(prev => new Map(prev).set(index, 'Failed to load image'));
  };

  // Extract productId for dependency array
  const productId = typeof params?.id === 'string' ? params.id : String(params?.id || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product with timeout
        const productPromise = adminApi.getProductById(productId);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const productRes = await Promise.race([productPromise, timeoutPromise]) as any;
        setProduct(productRes.data);

        if (productRes.data.variants && productRes.data.variants.length > 0) {
          setSelectedVariant(productRes.data.variants[0]);
        }

        // Fetch all products (non-blocking)
        adminApi.getProducts()
          .then((allRes) => {
            const productsData = allRes.data?.products || allRes.data;
        setAllProducts(Array.isArray(productsData) ? productsData : []);
          })
          .catch((err) => {
            console.warn('Failed to fetch all products:', err);
            setAllProducts([]);
          });
        
        // Fetch reviews for the product (non-blocking)
        fetchReviews(productId).catch(err => {
          console.warn('Failed to fetch reviews:', err);
        });
      } catch (error: any) {
        console.error('Fetch error:', error);
        
        // Use mock data as fallback when API is blocked
        try {
          const fallbackProductId = typeof params?.id === 'string' ? params.id : String(params?.id || '');
          const mockProduct = mockProducts.find(p => String(p.id) === fallbackProductId);
        
        if (mockProduct) {
          console.log('Using mock data for product:', mockProduct.name);
          setProduct(mockProduct);
          setAllProducts(mockProducts);
          
          // Set up mock variants if needed
          if (mockProduct.sizes && mockProduct.sizes.length > 0) {
            const mockVariants = mockProduct.sizes.map((size: string, index: number) => ({
              size,
              price: mockProduct.price + (index * 100), // Mock price variation
              sku: `${mockProduct.id}-${size.toLowerCase()}`
            }));
            setSelectedVariant(mockVariants[0]);
          }
          
            // Fetch reviews from API (only approved reviews are returned)
            fetchReviews(fallbackProductId).catch(err => {
              console.warn('Failed to fetch reviews:', err);
            });
            } else {
            setError('Product not found. Please try again later.');
          }
        } catch (fallbackError: any) {
          console.error('Fallback error:', fallbackError);
          setError(fallbackError.message || 'Failed to load product. Please refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
    fetchData();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId]);

  // Close share popup when clicking outside - MUST be before any conditional returns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSharePopup) {
        const target = event.target as HTMLElement;
        if (!target.closest('.share-popup-container')) {
          setShowSharePopup(false);
        }
      }
    };

    if (showSharePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSharePopup]);

  // Filter only approved reviews - MUST be before conditional returns
  const approvedReviews = Array.isArray(reviews) ? reviews.filter(r => r.isApproved !== false) : [];

  // Get all customer images from approved reviews
  const allCustomerImages = approvedReviews
    .filter(r => r.images && Array.isArray(r.images) && r.images.length > 0 && r.isApproved !== false)
    .flatMap(r => r.images || [])
    .filter(img => img && typeof img === 'string'); // Only include valid image strings

  // Filter and sort reviews (only approved reviews)
  const filteredReviews = approvedReviews.filter(review => {
    if (!reviewSearch) return true;
    const searchLower = reviewSearch.toLowerCase();
    return (
      review.name?.toLowerCase().includes(searchLower) ||
      review.text?.toLowerCase().includes(searchLower) ||
      review.title?.toLowerCase().includes(searchLower)
    );
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (reviewSort === 'mostRecent') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    } else if (reviewSort === 'highestRated') {
      return (b.rating || 0) - (a.rating || 0);
    } else if (reviewSort === 'lowestRated') {
      return (a.rating || 0) - (b.rating || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-amber-800">Loading product...</h1>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Product Not Found</h1>
          <p className="text-amber-700 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  
  // Get related products from same category, or fallback to any products
  const relatedProducts = Array.isArray(allProducts) && allProducts.length > 0
    ? (() => {
        const sameCategory = allProducts.filter(
          p => p.category === product.category && (p._id !== product._id && p.id !== product.id)
        );
        return sameCategory.length > 0 
          ? sameCategory.slice(0, 4)
          : allProducts.filter(p => p._id !== product._id && p.id !== product.id).slice(0, 4);
      })()
    : [];

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const inStock = product.quantity > 0 || product.status === 'in-stock' || product.inStock === true;

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }

    addItem({
      id: product._id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      variant: selectedVariant?.size || '',
      image: product.images?.[0] || ''
    });
    
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      icon: '🛒',
      duration: 2000
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Small delay to ensure item is added to cart before redirect
    setTimeout(() => {
      router.push('/checkout');
    }, 300);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = product.quantity || 100;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please sign in or create an account to submit a review', {
        icon: '🔒',
        duration: 3000
      });
      // Small delay then redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    if (!reviewText || reviewRating === 0) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setSubmittingReview(true);
    try {
      // Auto-fill title with product name if empty
      const finalTitle = reviewTitle || product.name;
      
      // Convert images to base64 data URLs
      const imagePromises = reviewImages.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string); // base64 data URL
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      // Wait for all images to be converted
      const imageBase64Array = await Promise.all(imagePromises);
      
      // Use logged-in user's info
      const reviewData = {
        productId: product._id || product.id,
        name: user.name || reviewName || 'User',
        email: user.email || reviewEmail,
        title: finalTitle,
        rating: reviewRating,
        text: reviewText,
        images: imageBase64Array // Include converted base64 images
      };

      // Try to submit to backend API with timeout
      try {
        const response = await Promise.race([
          adminApi.createReview(reviewData),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 15000) // Increased timeout for image uploads
          )
        ]) as any;
        
        // Show success message
        toast.success('Review submitted successfully!', {
          icon: '✅',
          duration: 500
        });
        
        // Reset form after showing message
        setTimeout(() => {
          setReviewName('');
          setReviewEmail('');
          setReviewTitle('');
          setReviewText('');
          setReviewRating(0);
          setReviewImages([]);
          setShowWriteReview(false);
          setShowReviewModal(false);
        }, 500);
        
      } catch (apiError: any) {
        console.log('API submission failed:', apiError);
        if (apiError.message === 'Request timeout') {
          // Even if timeout, show success message as backend may have received it
          toast.success('Review submitted successfully!', {
            icon: '✅',
            duration: 500
          });
          setReviewName('');
          setReviewEmail('');
          setReviewTitle('');
          setReviewText('');
          setReviewRating(0);
          setReviewImages([]);
          setShowWriteReview(false);
          setShowReviewModal(false);
        } else {
          toast.error(apiError.response?.data?.error || 'Failed to submit review. Please try again.');
        }
        return;
      }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setReviewImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center text-sm text-black">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-amber-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{product.name}</span>
          <button className="ml-auto text-black hover:text-amber-600">← PREV</button>
        </nav>

        {/* Main Product Section - PDP like reference site */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Column - Gallery with vertical thumbnails */}
          <div className="lg:col-span-7 grid grid-cols-5 gap-3 items-start">
            {/* Thumbs (left) */}
            <div className="col-span-1 hidden sm:flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-1">
              {product.images?.length > 0 && product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-amber-600 ring-2 ring-amber-300' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={getImageUrl(image, index)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="15vw"
                    onError={() => handleImageError(index, image)}
                    unoptimized={image?.startsWith('http') && !image?.includes('localhost')}
                  />
                </button>
              ))}
            </div>

            {/* Main Image (right) */}
            <div className="col-span-5 sm:col-span-4">
              <div 
                className="relative aspect-square bg-white border border-gray-200 rounded-md overflow-hidden cursor-zoom-in group"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
                onMouseEnter={() => {
                  // Enable zoom on desktop hover
                  if (isDesktop) {
                    setShowImageZoom(true);
                  }
                }}
                onMouseLeave={() => {
                  // Disable zoom on mouse leave (desktop)
                  if (isDesktop) {
                    setShowImageZoom(false);
                  }
                }}
                onClick={() => {
                  // Toggle zoom on click for mobile/tablet
                  setShowImageZoom(!showImageZoom);
                }}
              >
                <Image
                  src={getImageUrl(product.images?.[selectedImage], selectedImage)}
                  alt={product.name}
                  fill
                  className={`object-contain p-3 transition-transform duration-200 ease-out ${
                    showImageZoom ? 'scale-200' : 'scale-100'
                  }`}
                  style={{
                    transformOrigin: showImageZoom ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center center'
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => handleImageError(selectedImage, product.images?.[selectedImage] || '')}
                  unoptimized={product.images?.[selectedImage]?.startsWith('http') && !product.images?.[selectedImage]?.includes('localhost')}
                />
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-white font-bold text-xl">OUT OF STOCK</span>
                  </div>
                )}
                {showImageZoom && !isDesktop && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10 pointer-events-none">
                    Tap to zoom out
                  </div>
                )}
              </div>

              {/* Horizontal thumbs for mobile */}
              {product.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-2 sm:hidden">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-amber-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={getImageUrl(image, index)}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="20vw"
                        onError={() => handleImageError(index, image)}
                        unoptimized={image?.startsWith('http') && !image?.includes('localhost')}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sticky Buy Box */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 self-start">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">{product.name}</h1>
              
              {/* Subtitle/Badge */}
              {product.tags?.includes('Organic') && (
              <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {product.category || 'Organic'} | {product.tags?.join(' • ') || 'Premium Quality'}
                  </span>
                </div>
              )}
              
              {/* Review Count Badge */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
                      return (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-600">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {/* Vegetarian Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-4 h-4 border-2 border-green-600 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-xs text-black">This is a Vegetarian product</span>
              </div>
            </div>

            {/* Price Block (Reference Style) */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-3xl font-bold text-black">₹{currentPrice}</div>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <div className="text-xs text-green-700 font-semibold mb-2">
                  Save ₹{product.originalPrice - currentPrice}
                </div>
              )}
              <div className="text-sm text-gray-600">
                MRP (Incl. of all taxes)
              </div>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)}% off
                </div>
              )}
            </div>

            {/* Available Offers */}
            {(product.originalPrice || product.tags) && (
              <div className="bg-gray-50 p-2.5 rounded-md">
                <h3 className="font-semibold text-black mb-1 text-xs">Available Offers:</h3>
                <div className="space-y-1 text-xs text-black">
                  {product.originalPrice && (
                    <div className="flex items-start gap-1.5">
                      <CheckCircleIcon className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Flat ₹{product.originalPrice - currentPrice} off on this product</span>
                    </div>
                  )}
                  {product.tags?.includes('Organic') && (
                    <div className="flex items-start gap-1.5">
                      <CheckCircleIcon className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>100% Organic & Natural Product</span>
                    </div>
                  )}
                  {/* Expandable extra offers only if we actually have more */}
                  {((product.tags && product.tags.length > 1) || offersExpanded) && (
                    <>
                      {offersExpanded && (
                        <div className="flex items-start gap-1.5">
                          <CheckCircleIcon className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>No-cost EMI available on select cards</span>
                        </div>
                      )}
                      <button
                        className="text-amber-700 font-medium mt-1 text-xs"
                        onClick={() => setOffersExpanded(v => !v)}
                      >
                        {offersExpanded ? 'Show Less' : 'Show More'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Select Variant - Reference Style */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {product.variants.map((variant: any, index: number) => {
                    const variantPrice = variant.price || currentPrice;
                    const isSelected = selectedVariant?.size === variant.size;
                    return (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                        className={`relative p-4 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[#1a472a] bg-[#1a472a]/5'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                        <div className="font-bold text-base text-black mb-1">{variant.size || variant.name}</div>
                        <div className="font-semibold text-lg text-[#1a472a] mb-1">₹{variantPrice}</div>
                        <div className="text-xs text-gray-500">(Rs.{((variantPrice) / parseFloat(variant.size?.match(/\d+/)?.[0] || '1')).toFixed(2)}/{variant.size?.includes('ml') ? 'ml' : variant.size?.includes('kg') ? 'kg' : 'unit'})</div>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircleIcon className="w-5 h-5 text-[#1a472a]" />
                        </div>
                      )}
                    </button>
                    );
                  })}
                </div>
                {selectedVariant && (
                  <div className="p-3 bg-gray-50 rounded-md text-sm text-black border border-gray-200">
                    <span className="font-semibold">Selected:</span> {selectedVariant.size} - ₹{selectedVariant.price || currentPrice}
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-black mb-1.5 text-xs">Quantity:</h3>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 font-bold text-sm border-x-2 border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.quantity || 100)}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Hide total quantity label as requested */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all ${
                  inStock
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className={`flex-1 py-3 px-4 rounded-md font-bold text-sm transition-all ${
                  inStock
                    ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                BUY NOW
              </button>
              <button 
                onClick={async () => {
                  if (!user) {
                    toast.error('Please login to use wishlist');
                    router.push('/login');
                    return;
                  }

                  if (wishlistLoading) return;

                  setWishlistLoading(true);
                  const productId = product._id || product.id;
                  const inWishlist = isProductInWishlist(productId);
                  const success = inWishlist
                    ? await removeFromWishlist(productId)
                    : await addToWishlist(productId);

                  setWishlistLoading(false);

                  if (success) {
                    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
                  } else {
                    toast.error('Unable to update wishlist');
                  }
                }}
                disabled={wishlistLoading}
                className={`p-2.5 border-2 rounded-md transition-colors flex items-center justify-center ${
                  isProductInWishlist(product._id || product.id)
                    ? 'border-[#E67E22] text-[#E67E22] bg-[#FFF4EA]'
                    : 'border-gray-300 text-gray-500 hover:border-[#E67E22] hover:text-[#E67E22]'
                } ${wishlistLoading ? 'cursor-wait opacity-70' : ''}`}
                title={isProductInWishlist(product._id || product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isProductInWishlist(product._id || product.id) ? (
                  <HeartIconSolid className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Share - Icon button with text triggers popup */}
            <div className="pt-3 border-t border-gray-200 relative share-popup-container">
              <button
                onClick={() => setShowSharePopup(!showSharePopup)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                aria-label="Share"
                title="Share"
              >
                {/* Custom share SVG */}
                <svg width="18" height="18" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                  <g strokeWidth="0"/>
                  <g strokeLinecap="round" strokeLinejoin="round"/>
                  <g>
                    <path d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                </svg>
                <span className="text-sm font-medium">Share</span>
              </button>
              
              {/* Share Popup - Opens below icon */}
              {showSharePopup && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[200px]">
                  <div className="flex items-center gap-6">
                    {/* Facebook */}
                    <button
                      onClick={() => {
                        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                        window.open(url, '_blank', 'width=600,height=400');
                        setShowSharePopup(false);
                      }}
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                      title="Share on Facebook"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white">
                        <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Facebook</span>
                  </button>

                    {/* Twitter/X */}
                    <button
                      onClick={() => {
                        const text = `Check out ${product.name} from Dfoods`;
                        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
                        window.open(url, '_blank', 'width=600,height=400');
                        setShowSharePopup(false);
                      }}
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                      title="Share on Twitter"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white">
                        <svg className="w-6 h-6" fill="#1DA1F2" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Twitter</span>
                  </button>

                    {/* Email */}
                    <button
                      onClick={() => {
                        const subject = `Check out ${product.name}`;
                        const body = `I found this amazing product: ${product.name}\n\n${window.location.href}`;
                        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        setShowSharePopup(false);
                      }}
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                      title="Share via Email"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700">Email</span>
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details - Collapsible Sections (Reference Style) */}
        <div className="mb-8 bg-white">
          {/* Description */}
          <div className="border-b border-gray-200 group">
              <button
              onClick={() => setExpandedSections(prev => ({ ...prev, Description: !prev.Description }))}
              className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="font-bold text-[#1a472a] text-base">DESCRIPTION</span>
              {expandedSections.Description ? (
                <XMarkIcon className="w-5 h-5 text-[#1a472a]" />
              ) : (
                <PlusIcon className="w-5 h-5 text-[#1a472a]" />
              )}
              </div>
            {expandedSections.Description && (
              <div className="px-4 pb-6">
                <p className="text-gray-600 body-text leading-relaxed text-xs">
                  {product.description || 'Premium quality product made with care and expertise. Looking for that comforting taste of tradition? Every drop of our premium jaggery is crafted from the finest sugarcane, offering you authentic, wholesome flavors of India.'}
                </p>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="border-b border-gray-200 group">
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, Ingredients: !prev.Ingredients }))}
                className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-[#1a472a] text-base">INGREDIENTS</span>
                {expandedSections.Ingredients ? (
                  <XMarkIcon className="w-5 h-5 text-[#1a472a]" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-[#1a472a]" />
                )}
              </button>
              {expandedSections.Ingredients && (
                <div className="px-4 pb-6">
                  <ul className="list-disc list-inside space-y-2 text-gray-600 body-text text-xs">
                  {product.ingredients.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                </div>
              )}
              </div>
            )}

          {/* Benefits */}
          {(product.benefits || product.productInfo) && (
            <div className="border-b border-gray-200 group">
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, Benefits: !prev.Benefits }))}
                className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-[#1a472a] text-base">BENEFITS</span>
                {expandedSections.Benefits ? (
                  <XMarkIcon className="w-5 h-5 text-[#1a472a]" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-[#1a472a]" />
                )}
              </button>
              {expandedSections.Benefits && (
                <div className="px-4 pb-6">
                  <ul className="space-y-2 text-gray-600 body-text text-xs">
                    {product.benefits ? (
                      product.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Natural sweetener rich in minerals and vitamins</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Helps in digestion and boosts immunity</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Better alternative to refined sugar</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Made using traditional methods without chemicals</span>
                        </li>
                      </>
                    )}
                  </ul>
                  </div>
                )}
                  </div>
                )}

          {/* Storage Info */}
          {(product.shelfLife || product.storageInfo) && (
            <div className="border-b border-gray-200 group">
              <button
                onClick={() => setExpandedSections(prev => ({ ...prev, 'Storage Info': !prev['Storage Info'] }))}
                className="w-full flex items-center justify-between py-4 px-4 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span className="font-bold text-[#1a472a] text-base">STORAGE INFO</span>
                {expandedSections['Storage Info'] ? (
                  <XMarkIcon className="w-5 h-5 text-[#1a472a]" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-[#1a472a]" />
                )}
              </button>
              {expandedSections['Storage Info'] && (
                <div className="px-4 pb-6">
                  <p className="text-gray-600 font-normal text-sm">
                    {product.storageInfo || `Best stored away from direct sunlight and use a dry spoon every time before using. ${product.shelfLife ? `Best before ${product.shelfLife}.` : 'Best before 1 year from the date of packaging.'}`}
                  </p>
                  </div>
                )}
              </div>
            )}

          {/* FAQ Section - Always Visible, Centered Heading, Collapsible Answers */}
          <div className="border-b border-gray-200 py-6">
            <h3 className="text-xl font-bold text-[#1a472a] mb-6 text-center">FAQ</h3>
            <div className="space-y-0">
              {/* FAQ Question 1 */}
              <div className="border-b border-gray-200 py-4 group">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, 'FAQ1': !prev.FAQ1 }))}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="font-bold text-[#1a472a] text-sm">WHAT DOES "ORGANIC" MEAN?</span>
                  {expandedSections['FAQ1'] ? (
                    <XMarkIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  ) : (
                    <PlusIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedSections['FAQ1'] && (
                  <div className="mt-3 text-gray-600 font-normal text-sm leading-relaxed">
                    Organic jaggery means it is made from sugarcane grown without chemical fertilizers, pesticides, or synthetic additives. Our jaggery is certified organic and processed using traditional methods that preserve natural nutrients and flavors.
                  </div>
                )}
              </div>

              {/* FAQ Question 2 */}
              <div className="border-b border-gray-200 py-4 group">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, 'FAQ2': !prev.FAQ2 }))}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="font-bold text-[#1a472a] text-sm">WHAT MAKES THE DFOODS JAGGERY SPECIAL?</span>
                  {expandedSections['FAQ2'] ? (
                    <XMarkIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  ) : (
                    <PlusIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedSections['FAQ2'] && (
                  <div className="mt-3 text-gray-600 font-normal text-sm leading-relaxed">
                    Our jaggery is made using traditional methods passed down through generations. We use firewood and sun-baked fuel for processing. Fresh sugarcane juice is boiled, cooled naturally, and processed in small batches daily. We do not use any chemicals, preservatives, or artificial additives. It's simply 100% natural, offering you the best of what nature has to offer.
                  </div>
                )}
              </div>

              {/* FAQ Question 3 */}
              <div className="py-4 group">
                <button
                  onClick={() => setExpandedSections(prev => ({ ...prev, 'FAQ3': !prev.FAQ3 }))}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="font-bold text-[#1a472a] text-sm">HOW SHOULD I STORE THIS JAGGERY?</span>
                  {expandedSections['FAQ3'] ? (
                    <XMarkIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  ) : (
                    <PlusIcon className="w-4 h-4 text-[#1a472a] flex-shrink-0 ml-4" />
                  )}
                </button>
                {expandedSections['FAQ3'] && (
                  <div className="mt-3 text-gray-600 font-normal text-sm leading-relaxed">
                    Store in a cool, dry place away from direct sunlight. Always use a dry spoon to avoid moisture. Keep it in an airtight container to maintain freshness. Best before 1 year from the date of packaging.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommended Products - Between FAQ and Reviews */}
          {(relatedProducts.length > 0 || allProducts.length > 0) && (
            <div className="my-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a472a] mb-2 text-center">Recommended Products</h2>
                <div className="w-16 h-1 bg-[#1a472a] mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {(relatedProducts.length > 0 ? relatedProducts : allProducts.filter((p: any) => p._id !== product._id && p.id !== product.id).slice(0, 4)).map((relProduct: any) => (
                  <ProductCard key={relProduct._id || relProduct.id} product={relProduct} />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section - Always Visible, Centered Heading */}
          <div className="py-6">
            <h3 className="text-xl font-bold text-[#1a472a] mb-6 text-center">Customer Reviews</h3>
            
            <div className="px-4 pb-6">
                {/* Reviews Header - Image 1 Layout */}
                <div className="mb-8">
                  
                  {/* Three Column Layout: Left (Rating) | Center (Star Breakdown) | Right (Write Review) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left: Overall Rating */}
                    <div className="flex flex-col items-center md:items-start pb-6 border-b md:border-b-0 md:border-r border-gray-300 pr-6">
                      <div className="text-5xl font-bold text-[#1a472a] mb-2">
                        {approvedReviews.length > 0 
                          ? (approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length).toFixed(2)
                          : '0.00'
                        }
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => {
                          const avgRating = approvedReviews.length > 0 
                            ? approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length 
                            : 0;
                          return (
                            <svg key={i} className={`w-6 h-6 ${i < Math.floor(avgRating) ? 'text-yellow-400 fill-yellow-400' : i < avgRating ? 'text-yellow-300 fill-yellow-300' : 'text-gray-300'}`} viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          );
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        Based on {approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}
                      </div>
                </div>
                
                    {/* Center: Star Rating Breakdown */}
                    <div className="space-y-2 pb-6 border-b md:border-b-0 md:border-r border-gray-300 pr-6">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = approvedReviews.filter(r => (r.rating || 0) === stars).length;
                        const percentage = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2">
                            <div className="flex items-center gap-1 min-w-[60px]">
                              <span className="text-sm text-[#1a472a] font-semibold">{stars}</span>
                              <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${percentage > 50 ? 'bg-[#1a472a]' : 'bg-gray-300'}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 min-w-[30px] text-right">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Write Review Button */}
                    <div className="flex justify-center md:justify-end">
                      <button
                        onClick={() => {
                          // Check if user is logged in
                          if (!user) {
                            toast.error('Please sign in or create an account to write a review', {
                              icon: '🔒',
                              duration: 3000
                            });
                            setTimeout(() => {
                              router.push('/login');
                            }, 1500);
                            return;
                          }
                          setShowWriteReview(!showWriteReview);
                          if (!showWriteReview && product) {
                            setReviewTitle(product.name);
                            // Auto-fill with user info
                            if (user.name) setReviewName(user.name);
                            if (user.email) setReviewEmail(user.email);
                          }
                        }}
                        className="px-6 py-3 bg-[#1a472a] text-white text-sm font-semibold rounded-md hover:bg-[#153a22] transition-colors whitespace-nowrap"
                      >
                        Write a review
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Write Review Form - Image 2 Reference */}
                {showWriteReview && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-bold text-[#1a472a] mb-4">Write a review</h4>
                    
                  <div className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setReviewRating(i + 1)}
                              className={`transition-transform hover:scale-110 ${
                                i < reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              <svg className="w-8 h-8" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                            </button>
                              ))}
                            </div>
                          </div>

                      {/* Review Title (Auto-filled with product name) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Review Title <span className="text-gray-500 text-xs">(100)</span>
                        </label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          maxLength={100}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                          placeholder="Give your review a title"
                        />
                        </div>

                      {/* Review Content */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Review content</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a] min-h-[120px]"
                          placeholder="Start writing here..."
                        />
                      </div>

                      {/* Picture/Video Upload (Optional) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Picture/Video <span className="text-gray-500 text-xs">(optional)</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1a472a] transition-colors">
                          <input
                            type="file"
                            id="review-images"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="review-images"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-600">Click to upload images or videos</span>
                          </label>
                        </div>
                        {reviewImages.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {reviewImages.map((img, idx) => (
                              <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                                <Image
                                  src={URL.createObjectURL(img)}
                                  alt={`Preview ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                <button
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                      </div>
                    ))}
                  </div>
                        )}
                      </div>

                      {/* Display Name and Email - Auto-filled if logged in, readonly */}
                      {user ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Display name <span className="text-gray-500 text-xs font-normal">(from your account)</span>
                            </label>
                            <input
                              type="text"
                              value={user.name || reviewName}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address <span className="text-gray-500 text-xs font-normal">(from your account)</span></label>
                            <input
                              type="email"
                              value={user.email || reviewEmail}
                              readOnly
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Display name <span className="text-gray-500 text-xs font-normal">(displayed publicly like John Smith)</span>
                            </label>
                            <input
                              type="text"
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                              placeholder="Display name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                            <input
                              type="email"
                              value={reviewEmail}
                              onChange={(e) => setReviewEmail(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                              placeholder="Your email address"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => {
                            setShowWriteReview(false);
                            setReviewName('');
                            setReviewEmail('');
                            setReviewTitle('');
                            setReviewText('');
                            setReviewRating(0);
                            setReviewImages([]);
                          }}
                          className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitReview}
                          disabled={submittingReview}
                          className={`flex-1 px-6 py-2.5 bg-[#1a472a] text-white text-sm font-semibold rounded-lg hover:bg-[#153a22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Photos & Videos Section - Image 3 Reference */}
                {allCustomerImages.length > 0 && (
                  <div className="mb-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-[#1a472a] mb-4 text-sm">Customer photos & videos</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {allCustomerImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                          <Image
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                            alt="Customer photo"
                            fill
                            className="object-cover"
                            sizes="25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search and Sort - Image 3 Reference */}
                {approvedReviews.length > 0 && (
                  <div className="mb-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Search Bar */}
                    <div className="flex-1 w-full sm:max-w-md">
                      <div className="relative">
                        <input
                          type="text"
                          value={reviewSearch}
                          onChange={(e) => setReviewSearch(e.target.value)}
                          placeholder="Search"
                          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={reviewSort}
                        onChange={(e) => setReviewSort(e.target.value)}
                        className="px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a472a] appearance-none bg-white cursor-pointer"
                      >
                        <option value="mostRecent">Most Recent</option>
                        <option value="highestRated">Highest Rated</option>
                        <option value="lowestRated">Lowest Rated</option>
                      </select>
                      <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Individual Reviews - Image 3 Reference */}
                {sortedReviews.length > 0 ? (
                  <div className="space-y-6">
                    {sortedReviews.map((review, index) => (
                      <div key={index} className="pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-[#1a472a] rounded-full flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                              {review.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[#1a472a] text-sm">{review.name || 'Anonymous'}</span>
                                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">Verified</span>
                              </div>
                              {review.title && (
                                <div className="text-sm font-medium text-gray-700 mb-1">{review.title}</div>
                              )}
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                          </span>
                        </div>
                        {review.text && (
                          <p className="text-gray-700 text-sm leading-relaxed mt-3">{review.text}</p>
                        )}
                        {/* Display review images if available */}
                        {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {review.images.map((img: string, imgIdx: number) => (
                              <div key={imgIdx} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300">
                                <Image
                                  src={img}
                                  alt={`Review image ${imgIdx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : approvedReviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm mb-4">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No reviews match your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-black">Write a Review</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewRating(i + 1)}
                        className={`transition-transform hover:scale-110 ${
                          i < reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={4}
                    placeholder="Share your experience with this product..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!reviewName || !reviewText || reviewRating === 0 || submittingReview}
                    className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                      !reviewName || !reviewText || reviewRating === 0 || submittingReview
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
