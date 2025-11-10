'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cartStore';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store';
import { 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  EnvelopeIcon,
  HomeIcon,
  CheckCircleIcon,
  XMarkIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    serviceCharge: 0,
    delivery: 0,
    discount: 0,
    total: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/products');
      return;
    }

    // Calculate order summary
    const subtotal = getTotalPrice();
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const tax = (subtotal - discount) * 0.18; // 18% GST
    const serviceCharge = (subtotal - discount) * 0.02; // 2% service charge
    const delivery = 0; // Free delivery
    const total = subtotal - discount + tax + serviceCharge + delivery;

    setOrderSummary({
      subtotal,
      tax,
      serviceCharge,
      delivery,
      discount,
      total
    });

    // Pre-fill user data if available
    if (user.name) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.name,
        phone: user.phone || ''
      }));
    }
  }, [user, items, getTotalPrice, router, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal: getTotalPrice()
        })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        toast.success(`Coupon applied! You saved ₹${data.coupon.discount.toFixed(2)}`);
      } else {
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const requiredFields = ['fullName', 'address', 'city', 'state', 'country', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof ShippingAddress]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      // Create order using API client
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress,
          items: items.map(item => ({
            product: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // Create payment intent
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: order._id || order.id,
          paymentMethod
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      if (paymentMethod === 'stripe') {
        // Initialize Stripe
        const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        
        const { error } = await stripe.confirmPayment({
          elements: stripe.elements(),
          clientSecret: paymentData.clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/order-success`,
          },
        });

        if (error) {
          throw new Error(error.message);
        }
      } else if (paymentMethod === 'razorpay') {
        // Initialize Razorpay
        const options = {
          key: paymentData.key,
          amount: paymentData.razorpayOrder.amount,
          currency: paymentData.razorpayOrder.currency,
          name: 'Dfoods',
          description: `Order #${order._id}`,
          order_id: paymentData.razorpayOrder.id,
          handler: async function (response: any) {
            try {
              const token = localStorage.getItem('token');
              // Verify payment on backend
              const confirmResponse = await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderId: order._id || order.id,
                  paymentMethod: 'razorpay',
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                })
              });

              if (confirmResponse.ok) {
                clearCart();
                toast.success('Order placed successfully!');
                setTimeout(() => {
                  router.push('/order-success');
                }, 1000);
              } else {
                const errorData = await confirmResponse.json();
                throw new Error(errorData.message || 'Payment verification failed');
              }
            } catch (error: any) {
              console.error('Payment verification error:', error);
              toast.error(error.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: user.email,
            contact: shippingAddress.phone
          },
          theme: {
            color: '#E67E22'
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-[#8B4513]">Redirecting to login...</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-[#8B4513] mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious products to your cart before checkout.</p>
          <Link 
            href="/products" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Shipping', icon: TruckIcon },
    { number: 2, title: 'Payment', icon: CreditCardIcon },
    { number: 3, title: 'Review', icon: CheckCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-[#8B4513] via-[#E67E22] to-[#D35400] bg-clip-text text-transparent mb-8">
            Secure Checkout
          </h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-4 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-[#E67E22] to-[#D35400] border-[#E67E22] text-white shadow-lg scale-110'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <step.icon className="w-5 h-5 md:w-7 md:h-7" />
                  )}
                </motion.div>
                <div className="hidden md:block ml-3">
                  <p className={`text-sm font-semibold ${currentStep >= step.number ? 'text-[#E67E22]' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 md:mx-4 rounded-full transition-all ${
                    currentStep > step.number ? 'bg-gradient-to-r from-[#E67E22] to-[#D35400]' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Form Steps */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-amber-200"
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-xl mr-4">
                      <MapPinIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#8B4513]">Shipping Address</h2>
                      <p className="text-gray-600 text-sm">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <HomeIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="Street address, apartment, suite, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="Maharashtra"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <MapPinIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="400001"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                        <PhoneIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] transition-all"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="w-full mt-8 bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg flex items-center justify-center"
                  >
                    Continue to Payment
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-amber-200"
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-[#E67E22] to-[#D35400] rounded-xl mr-4">
                      <CreditCardIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#8B4513]">Payment Method</h2>
                      <p className="text-gray-600 text-sm">Choose your preferred payment method</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-6 border-3 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === 'razorpay'
                          ? 'border-[#E67E22] bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#E67E22]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-[#E67E22] focus:ring-[#E67E22]"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <ShieldCheckIcon className="w-6 h-6 text-[#E67E22] mr-2" />
                          <div className="font-bold text-lg text-gray-900">Razorpay</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">UPI, Cards, Net Banking, Wallets</div>
                      </div>
                      {paymentMethod === 'razorpay' && (
                        <CheckCircleIcon className="w-6 h-6 text-[#E67E22]" />
                      )}
                    </motion.label>

                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-6 border-3 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-[#E67E22] bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#E67E22]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-[#E67E22] focus:ring-[#E67E22]"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <CreditCardIcon className="w-6 h-6 text-[#E67E22] mr-2" />
                          <div className="font-bold text-lg text-gray-900">Credit/Debit Card</div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Visa, Mastercard, American Express</div>
                      </div>
                      {paymentMethod === 'stripe' && (
                        <CheckCircleIcon className="w-6 h-6 text-[#E67E22]" />
                      )}
                    </motion.label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 transition-all font-semibold flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="flex-1 bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <CheckCircleIcon className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-amber-200 lg:sticky lg:top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#8B4513]">Order Summary</h2>
                <SparklesIcon className="w-6 h-6 text-[#E67E22]" />
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50"
                  >
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden shadow-md">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🍯
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500">Size: {item.variant}</p>
                      )}
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#E67E22]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t-2 border-dashed border-gray-200 pt-4 mb-4">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <TagIcon className="w-4 h-4 mr-2 text-[#E67E22]" />
                  Have a coupon code?
                </label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-[#E67E22] text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all text-sm font-semibold"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-green-800 text-sm">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">Discount applied! 🎉</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-semibold text-sm">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{orderSummary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>GST (18%):</span>
                  <span className="font-semibold">₹{orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Service Charge (2%):</span>
                  <span className="font-semibold">₹{orderSummary.serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Delivery:</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-[#8B4513] border-t-2 border-gray-300 pt-3">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-[#E67E22] to-[#D35400] bg-clip-text text-transparent">
                    ₹{orderSummary.total.toFixed(2)}
                  </span>
                </div>
                {appliedCoupon && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-center text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-semibold py-2 rounded-lg"
                  >
                    🎉 You saved ₹{orderSummary.discount.toFixed(2)}!
                  </motion.div>
                )}
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium">Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <TruckIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Free delivery on all orders</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium">30-day return guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 text-center mt-8"
        >
          By placing this order, you agree to our{' '}
          <Link href="/terms" className="text-[#E67E22] hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#E67E22] hover:underline">Privacy Policy</Link>
        </motion.p>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E67E22;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D35400;
        }
      `}</style>
    </div>
  );
}
