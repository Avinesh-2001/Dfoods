'use client';

import { useState, useEffect } from 'react';
import {
  CubeIcon,
  StarIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { adminApi } from '@/lib/api/api';

const getStats = (statsData) => [
  {
    name: 'Total Products',
    value: statsData.totalProducts.toString(),
    change: '+2',
    changeType: 'positive',
    icon: CubeIcon,
  },
  {
    name: 'Total Reviews',
    value: statsData.totalReviews.toString(),
    change: '+12',
    changeType: 'positive',
    icon: StarIcon,
  },
  {
    name: 'Total Revenue',
    value: `₹${statsData.totalRevenue.toLocaleString()}`,
    change: '+89',
    changeType: 'positive',
    icon: EnvelopeIcon,
  },
  {
    name: 'Total Users',
    value: statsData.totalUsers.toString(),
    change: '+5',
    changeType: 'positive',
    icon: UserGroupIcon,
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'review',
    message: 'New review received for "Premium Organic Jaggery"',
    time: '2 minutes ago',
    icon: StarIcon,
  },
  {
    id: 2,
    type: 'product',
    message: 'Product "Cardamom Jaggery" was updated',
    time: '15 minutes ago',
    icon: CubeIcon,
  },
  {
    id: 3,
    type: 'email',
    message: 'Welcome email sent to new user',
    time: '1 hour ago',
    icon: EnvelopeIcon,
  },
  {
    id: 4,
    type: 'user',
    message: 'New user registered',
    time: '2 hours ago',
    icon: UserGroupIcon,
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalReviews: 0,
    pendingReviews: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as fallback
      setStats({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalReviews: 0,
        pendingReviews: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats(stats).map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 text-left bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
              <div className="flex items-center">
                <CubeIcon className="h-5 w-5 text-amber-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Add New Product</span>
              </div>
              <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Send Email Campaign</span>
              </div>
              <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
              </div>
              <EyeIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="flex-shrink-0">
                  <activity.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
