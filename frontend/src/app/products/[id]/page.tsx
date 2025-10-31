'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { MinusIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { ShareIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ui/ProductCard';
import { adminApi } from '@/lib/api/api';
import { products as mockProducts } from '@/lib/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Description' | 'Ingredients' | 'Product Information' | 'FAQ' | 'Reviews'>('Description');
  const [offersExpanded, setOffersExpanded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Map<number, string>>(new Map());

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

  useEffect(() => {
    const productId = typeof params?.id === 'string' ? params.id : String(params?.id || '');
    
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

  
  const relatedProducts = Array.isArray(allProducts) 
    ? allProducts
        .filter(p => p.category === product.category && (p._id !== product._id || p.id !== product.id))
        .slice(0, 4)
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
    router.push('/cart');
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = product.quantity || 100;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewName || !reviewText || reviewRating === 0) return;
    
    setSubmittingReview(true);
    try {
      // Try to submit to backend API first
      try {
        const response = await adminApi.createReview({
          productId: product._id || product.id,
          name: reviewName,
          rating: reviewRating,
          text: reviewText
        });
        
        if (response.data.review) {
          setReviews(prev => [response.data.review, ...prev]);
        }
      } catch (apiError) {
        console.log('API submission failed, using local storage:', apiError);
        // Fallback to local storage if API fails
        const newReview = {
          name: reviewName,
          rating: reviewRating,
          text: reviewText,
          createdAt: new Date().toISOString()
        };
        
        setReviews(prev => [newReview, ...prev]);
        
        // Save to localStorage as backup
        const existingReviews = JSON.parse(localStorage.getItem(`reviews_${product._id || product.id}`) || '[]');
        existingReviews.unshift(newReview);
        localStorage.setItem(`reviews_${product._id || product.id}`, JSON.stringify(existingReviews));
      }
      
      setReviewName('');
      setReviewText('');
      setReviewRating(0);
      setShowReviewModal(false);
      
      toast.success('Review submitted successfully! It will be visible after admin approval.', {
        icon: '⭐',
        duration: 4000
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
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
              <h1 className="text-xl font-bold text-black mb-1">{product.name}</h1>
              
              {/* Vegetarian Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 border-2 border-green-600 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-xs text-black">This is a Vegetarian product</span>
              </div>
            </div>

            {/* Price Block (MRP, current, savings) */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5">
              <div className="flex items-end gap-2">
                <div className="text-xl font-extrabold text-black">₹{currentPrice}</div>
                {product.originalPrice && product.originalPrice > currentPrice && (
                  <>
                    <div className="text-gray-400 line-through text-xs">₹{product.originalPrice}</div>
                    <div className="text-green-700 font-semibold text-xs">
                      Save ₹{product.originalPrice - currentPrice}
                    </div>
                  </>
                )}
              </div>
              {product.sku && (
                <div className="mt-1 text-xs text-black">SKU: {product.sku}</div>
              )}
              {product.productInfo && (
                <div className="mt-1 text-xs text-black">
                  <span className="font-semibold">USP:</span> {product.productInfo}
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

            {/* Select Variant */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-black mb-1.5 text-xs">Select Variant</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative p-2.5 rounded-md border-2 text-left transition-all ${
                        selectedVariant?.size === variant.size
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-bold text-sm text-black">{variant.size}</div>
                      {selectedVariant?.size === variant.size && (
                        <div className="mt-1 space-y-0.5 text-xs text-black">
                          <div>SKU: {product.sku}</div>
                          <div className="font-semibold">MRP: ₹ {variant.price}.00</div>
                          <div className="text-gray-500">(Inc of All Taxes)</div>
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                          <span className="ml-2 text-xs font-semibold text-green-600">
                            ₹{variant.price}
                          </span>
                        </div>
                      )}
                      {selectedVariant?.size === variant.size && (
                        <div className="absolute top-1.5 right-1.5">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-black">
                    <span className="font-semibold">USP:</span> {product.productInfo || product.description || 'Premium quality product'}
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
              <button className="p-2.5 border-2 border-gray-300 rounded-md hover:border-amber-600 transition-colors">
                <HeartIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Share */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-black text-sm">Share:</span>
                <div className="flex gap-2">
                  {/* Facebook */}
                  <button
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                      window.open(url, '_blank', 'width=600,height=400');
                    }}
                    className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors shadow-md hover:shadow-lg"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={() => {
                      // Instagram doesn't support direct sharing, so we'll copy link to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied! Paste it on Instagram', { icon: '📋' });
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                    title="Share on Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = `Check out this product: ${product.name}\n${window.location.href}`;
                      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                    className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20BA5A] transition-colors shadow-md hover:shadow-lg"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </button>

                  {/* Share Icon (Native Share API) */}
                  <button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: product.name,
                            text: `Check out ${product.name} from Dfoods`,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Error sharing', err);
                        }
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!', { icon: '📋' });
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                    title="Share"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - working tabs */}
        <div className="mb-8 bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="grid grid-cols-5 border-b border-gray-200">
            {(['Description', 'Ingredients', 'Product Information', 'FAQ', 'Reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2.5 px-2 sm:px-3 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === tab ? 'text-amber-700 border-amber-600 bg-amber-50' : 'text-black border-transparent hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            {activeTab === 'Description' && (
              <div className="prose max-w-none">
                <p className="text-black leading-relaxed text-sm">
                  {product.description || 'Premium quality product made with care and expertise.'}
                </p>
              </div>
            )}

            {activeTab === 'Ingredients' && product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-1.5 text-sm">Ingredients</h4>
                <ul className="list-disc list-inside space-y-0.5">
                  {product.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="text-black text-xs">{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'Product Information' && (
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-black">
                {product.productInfo && (
                  <div>
                    <h5 className="font-semibold text-black">USP</h5>
                    <p>{product.productInfo}</p>
                  </div>
                )}
                {product.shelfLife && (
                  <div>
                    <h5 className="font-semibold text-black">Shelf Life</h5>
                    <p>{product.shelfLife}</p>
                  </div>
                )}
                {product.manufacturer && (
                  <div>
                    <h5 className="font-semibold text-black">Manufacturer</h5>
                    <p>{product.manufacturer}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'FAQ' && (
              <div>
                <h4 className="font-semibold text-black mb-1.5 text-sm">FAQ</h4>
                <ul className="space-y-1.5 text-black text-xs">
                  <li>
                    <span className="font-semibold">Does it have any side effects?</span> No known side effects.
                  </li>
                  <li>
                    <span className="font-semibold">Can I use it daily?</span> Safe for everyday consumption unless otherwise advised by your physician.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-black text-sm">Customer Reviews ({reviews.length})</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => product && fetchReviews(product._id || product.id || params.id as string)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-300 transition-colors"
                      title="Refresh reviews"
                    >
                      🔄 Refresh
                    </button>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-black text-sm">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-black text-xs">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Related Products</h2>
              <div className="w-16 h-1 bg-amber-600 mx-auto rounded-full"></div>
              <p className="text-sm text-gray-600 mt-3">Discover more amazing jaggery products</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {relatedProducts.map((relProduct: any) => (
                <ProductCard key={relProduct._id || relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

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
                        className={`text-2xl transition-colors ${
                          i < reviewRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
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
