'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  BuildingOfficeIcon,
  GlobeAltIcon
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
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    serviceCharge: 0,
    delivery: 0,
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
    const tax = subtotal * 0.18; // 18% GST
    const serviceCharge = subtotal * 0.02; // 2% service charge
    const delivery = 0; // Free delivery
    const total = subtotal + tax + serviceCharge + delivery;

    setOrderSummary({
      subtotal,
      tax,
      serviceCharge,
      delivery,
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
  }, [user, items, getTotalPrice, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    // Validate shipping address
    const requiredFields = ['fullName', 'address', 'city', 'state', 'country', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof ShippingAddress]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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
      const paymentResponse = await fetch('http://localhost:5000/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: order._id,
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
              // Verify payment on backend
              const confirmResponse = await fetch('http://localhost:5000/api/payments/confirm', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  orderId: order._id,
                  paymentMethod: 'razorpay',
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature
                })
              });

              if (confirmResponse.ok) {
                clearCart();
                toast.success('Order placed successfully!');
                router.push('/order-success');
              } else {
                throw new Error('Payment verification failed');
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
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-[#8B4513]">Redirecting to login...</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-[#8B4513] mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          <Link href="/products" className="inline-block px-6 py-3 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#8B4513] mb-4">Checkout</h1>
          <p className="text-lg text-gray-600">Complete your order securely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Shipping & Payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <MapPinIcon className="w-6 h-6 text-[#E67E22] mr-3" />
                <h2 className="text-2xl font-bold text-[#8B4513]">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCardIcon className="w-6 h-6 text-[#E67E22] mr-3" />
                <h2 className="text-2xl font-bold text-[#8B4513]">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-[#E67E22] rounded-lg cursor-pointer bg-orange-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <div className="flex items-center">
                    <CreditCardIcon className="w-6 h-6 text-[#E67E22] mr-3" />
                    <div>
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#E67E22]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <div className="flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 text-[#E67E22] mr-3" />
                    <div>
                      <div className="font-semibold">Razorpay</div>
                      <div className="text-sm text-gray-600">UPI, Net Banking, Wallets</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={`${item.id}-${item.variant}`} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍯
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500">Size: {item.variant}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#E67E22]">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{orderSummary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%):</span>
                  <span>₹{orderSummary.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Charge (2%):</span>
                  <span>₹{orderSummary.serviceCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery:</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#8B4513] border-t border-gray-300 pt-3">
                  <span>Total:</span>
                  <span>₹{orderSummary.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  <span>Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                  <span>Free delivery on all orders</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-600 mr-2" />
                  <span>30-day return guarantee</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-[#E67E22] to-[#D35400] text-white py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Processing Payment...
                  </div>
                ) : (
                  `Place Order - ₹${orderSummary.total.toLocaleString()}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
