'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ShoppingCartIcon, 
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, clearUser } from '@/store';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { getTotalItems, toggleCart } = useCartStore();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const totalItems = getTotalItems();

  const handleLogout = () => {
    dispatch(clearUser());
    toast.success('Logged out successfully!');
    setIsOpen(false);
  };

  const headerBackground = isScrolled 
    ? 'radial-gradient(circle at center, rgba(251, 146, 60, 0.4) 0%, rgba(249, 115, 22, 0.45) 50%, rgba(234, 88, 12, 0.5) 100%)'
    : 'radial-gradient(circle at center, rgba(251, 146, 60, 0.35) 0%, rgba(249, 115, 22, 0.4) 50%, rgba(234, 88, 12, 0.45) 100%)';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled 
            ? 'shadow-lg' 
            : ''
        }`}
        style={{
          background: headerBackground,
          backdropFilter: 'blur(10px)',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#E67E22] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#8B4513]">Dfoods</h1>
                <p className="text-xs text-[#C0392B] -mt-1">Pure Traditional Sweetness</p>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[#E67E22] ${
                    pathname === item.href 
                      ? 'text-[#E67E22]' 
                      : 'text-[#8B4513]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/products" className="p-2 text-[#8B4513] hover:text-[#E67E22] transition-colors" title="Search Products">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Link>

              <div className="relative z-[100] profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-[#8B4513] hover:text-[#E67E22] transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[200] animate-fadeIn">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#8B4513]">
                        {user ? `Hi, ${user.name}` : 'Welcome!'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user ? 'Manage your account' : 'Sign in to your account'}
                      </p>
                    </div>
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Wishlist
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                )}
              </div>

              <button
                onClick={toggleCart}
                className="relative p-2 text-[#8B4513] hover:text-[#E67E22] transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-[#C0392B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-[#8B4513] hover:text-[#E67E22] transition-colors"
              >
                {isOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-[#E67E22] bg-[#FDF6E3]'
                        : 'text-[#8B4513] hover:text-[#E67E22] hover:bg-[#FDF6E3]'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {user && user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === '/admin'
                        ? 'text-[#E67E22] bg-[#FDF6E3]'
                        : 'text-[#8B4513] hover:text-[#E67E22] hover:bg-[#FDF6E3]'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors text-[#8B4513] hover:text-[#E67E22] hover:bg-[#FDF6E3]"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        pathname === '/login'
                          ? 'text-[#E67E22] bg-[#FDF6E3]'
                          : 'text-[#8B4513] hover:text-[#E67E22] hover:bg-[#FDF6E3]'
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        pathname === '/register'
                          ? 'text-[#E67E22] bg-[#FDF6E3]'
                          : 'text-[#8B4513] hover:text-[#E67E22] hover:bg-[#FDF6E3]'
                      }`}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="h-16" />
    </>
  );
}