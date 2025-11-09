"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { RootState, clearUser } from "@/store";
import { useCartStore } from "@/lib/store/cartStore";
import toast from "react-hot-toast";

const THEME_ORANGE = '#E67E22';

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { getTotalItems, toggleCart, clearCart } = useCartStore();
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isProfileOpen && !target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen]);

  // Handle search navigation
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const totalItems = getTotalItems();

  const handleLogout = () => {
    dispatch(clearUser());
    clearCart(); // Clear cart when logging out
    toast.success("Logged out successfully!");
    setIsOpen(false);
  };

  const headerBackground = isScrolled
    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.85) 0%, rgba(249, 115, 22, 0.9) 100%)"
    : "linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(249, 115, 22, 0.85) 100%)";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
        style={{
          background: headerBackground,
          backdropFilter: "blur(10px)",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-16 flex items-center">
                <img
                  src="/images/Dfood_logo.png"
                  alt="Dfoods"
                  className="h-16 md:h-16 w-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name} 
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    pathname === item.href
                      ? "text-white font-semibold"
                      : "text-white/90"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Side - Desktop and Mobile */}
            <div className="flex items-center space-x-4">
              {/* Desktop Icons - Only visible on desktop */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:block p-2 text-white/90 hover:text-white transition-colors relative"
                title="Search Products"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              <div className="hidden md:block relative z-[100] profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-1 text-white/90 hover:text-white transition-colors"
                >
                  {user && (user as any).profilePhoto ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/90">
                      <img 
                        src={(user as any).profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-[200] animate-fadeIn">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                        {user && (user as any).profilePhoto && (
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src={(user as any).profilePhoto} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#F97316]">
                            {user ? `Hi, ${user.name}` : "Welcome!"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user
                              ? "Manage your account"
                              : "Sign in to your account"}
                          </p>
                        </div>
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
                          {user.role === "admin" && (
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
                className="hidden md:block relative p-2 text-white/90 hover:text-white transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-white text-[#F97316] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Hamburger - Always visible on mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2.5 bg-white rounded-lg shadow-lg hover:bg-white transition-all"
                aria-label="Menu"
              >
                {isOpen ? (
                  <XMarkIcon className="w-7 h-7 text-black" strokeWidth={2.5} />
                ) : (
                  <Bars3Icon className="w-7 h-7 text-black" strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-[#E67E22]/20 shadow-lg"
            >
              <div className="px-4 py-4 space-y-1">
                {/* User Info Section */}
                {user && (
                  <div className="px-3 py-3 mb-2 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FFF4EA' }}>
                    {(user as any).profilePhoto && (
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={(user as any).profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: THEME_ORANGE }}>
                        Hi, {user.name}
                      </p>
                      <p className="text-xs text-black/70 truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                      pathname === item.href
                        ? "text-[#E67E22] bg-[#FFF4EA]"
                        : "text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Search Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Search Products
                </button>

                {/* Cart Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    toggleCart();
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full font-bold text-white" style={{ backgroundColor: THEME_ORANGE }}>
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* User Menu Items */}
                {user ? (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                    >
                      <UserIcon className="w-5 h-5" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                    >
                      <HeartIcon className="w-5 h-5" />
                      Wishlist
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-black hover:text-[#E67E22] hover:bg-[#FFF4EA]"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-white text-center"
                      style={{ backgroundColor: THEME_ORANGE }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 text-base font-medium rounded-lg transition-colors border-2 text-center"
                      style={{ borderColor: THEME_ORANGE, color: THEME_ORANGE }}
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="fixed inset-0 bg-gray-700/95 z-[2000]"
            />

            {/* Search Bar with Arrow */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[2001] w-full max-w-2xl px-4"
            >
              {/* Arrow pointing up to search icon */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-white"></div>

              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="bg-white rounded-lg shadow-2xl flex items-center px-4 py-4">
                  <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="I am looking for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="ml-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
