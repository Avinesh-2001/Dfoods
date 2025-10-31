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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = params.id as string;
        const productRes = await adminApi.getProductById(productId);
        setProduct(productRes.data);

        if (productRes.data.variants && productRes.data.variants.length > 0) {
          setSelectedVariant(productRes.data.variants[0]);
        }

        const allRes = await adminApi.getProducts();
        // Handle both direct array and wrapped object formats
        const productsData = allRes.data.products || allRes.data;
        setAllProducts(Array.isArray(productsData) ? productsData : []);
        
        // Fetch reviews for the product
        await fetchReviews(productId);
      } catch (error: any) {
        console.error('Fetch error:', error);
        
        // Use mock data as fallback when API is blocked
        const productId = params.id as string;
        const mockProduct = mockProducts.find(p => String(p.id) === productId);
        
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
          await fetchReviews(productId);
        } else {
          setError('Product not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

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
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="15vw"
                  />
                </button>
              ))}
            </div>

            {/* Main Image (right) */}
            <div className="col-span-5 sm:col-span-4">
              <div className="relative aspect-square bg-white border border-gray-200 rounded-md overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">OUT OF STOCK</span>
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
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="20vw"
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
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 text-xs">
                    f
                  </button>
                  <button className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 text-xs">
                    T
                  </button>
                  <button className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 text-xs">
                    W
                  </button>
                  <button className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 text-xs">
                    P
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
