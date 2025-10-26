'use client';

import { motion } from 'framer-motion';
import { GiftIcon, StarIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';

const rewardsData = [
  {
    title: "Welcome Bonus",
    description: "Get 10% off your first order when you sign up",
    points: 100,
    icon: GiftIcon,
    color: "from-green-400 to-green-600"
  },
  {
    title: "Loyalty Points",
    description: "Earn 1 point for every ₹10 spent",
    points: 500,
    icon: StarIcon,
    color: "from-yellow-400 to-yellow-600"
  },
  {
    title: "Referral Reward",
    description: "Get ₹100 off when you refer a friend",
    points: 250,
    icon: TrophyIcon,
    color: "from-purple-400 to-purple-600"
  },
  {
    title: "Birthday Special",
    description: "Enjoy 15% off on your birthday month",
    points: 150,
    icon: SparklesIcon,
    color: "from-pink-400 to-pink-600"
  }
];

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#8B4513] mb-4">
            Dfoods Rewards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn points with every purchase and unlock exclusive rewards. Join our loyalty program today!
          </p>
        </motion.div>

        {/* Current Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#E67E22] to-[#D35400] rounded-lg p-8 text-white text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-2">Your Current Points</h2>
          <div className="text-6xl font-bold mb-4">1,250</div>
          <p className="text-lg opacity-90">Keep shopping to earn more rewards!</p>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rewardsData.map((reward, index) => (
            <motion.div
              key={reward.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${reward.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <reward.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#8B4513] mb-2">{reward.title}</h3>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              <div className="text-2xl font-bold text-[#E67E22]">{reward.points} pts</div>
            </motion.div>
          ))}
        </div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg shadow-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-[#8B4513] mb-6 text-center">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E67E22] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Shop</h3>
              <p className="text-gray-600">Make purchases on our website and earn points automatically</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E67E22] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Earn</h3>
              <p className="text-gray-600">Accumulate points with every purchase and special activities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E67E22] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-[#8B4513] mb-2">Redeem</h3>
              <p className="text-gray-600">Use your points to get discounts and exclusive rewards</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-[#8B4513] mb-4">Ready to Start Earning?</h2>
          <p className="text-lg text-gray-600 mb-6">Sign up for our rewards program and start earning points today!</p>
          <motion.button
            className="bg-[#E67E22] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#D35400] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Rewards Program
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
