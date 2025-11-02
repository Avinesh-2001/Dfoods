'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, TruckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Fetch orders
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setOrders(data.orders || data || []);
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user, router]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'processing':
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <ShoppingBagIcon className="w-8 h-8 text-[#F97316] mr-3" />
            My Orders
          </h1>
          <p className="text-gray-600">View and track your order history</p>
        </motion.div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id || order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        Order #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-lg font-semibold text-[#F97316] mt-2">
                      ₹{order.totalAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/orders/${order._id || order.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-colors font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBagIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white rounded-lg hover:from-[#F97316] hover:to-[#EA580C] transition-colors font-semibold"
            >
              Browse Products
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

