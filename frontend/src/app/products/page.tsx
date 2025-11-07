'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ProductCard from '@/components/ui/ProductCard';
import { 
  FunnelIcon, 
  XMarkIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { adminApi } from '@/lib/api/api';
import { products as mockProducts } from '@/lib/data/products';

const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'price-asc', label: 'Price Low to High' },
  { value: 'price-desc', label: 'Price High to Low' },
];

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'plain-jaggery', label: 'Plain Jaggery' },
  { value: 'jaggery-powder', label: 'Jaggery Powder' },
  { value: 'jaggery-cubes', label: 'Jaggery Cubes' },
  { value: 'flavoured-jaggery', label: 'Flavoured Jaggery' },
  { value: 'gud-combo', label: 'Gud Combo' },
];

const availabilityOptions = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'low-stock', label: 'Low Stock' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 2000],
    availability: [] as string[],
  });
  const [sortBy, setSortBy] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState({ desktop: 4, mobile: 2 }); // Default: 4 desktop, 2 mobile
  const itemsPerPage = 12;

  // Get search query from URL parameter
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [searchParams]);

  // Prevent body scroll when filter overlay is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAllProducts(data);
        setError(null);
      } catch (error) {
        console.log('API unavailable, using mock data');
        setAllProducts(mockProducts.map((p: any) => ({
          ...p,
          _id: p.id ?? p._id,
        })) as any[]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const matchesDescription = product.description?.toLowerCase().includes(query);
        
        if (!matchesName && !matchesTags && !matchesDescription) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Price range filter
      const productPrice = product.variants && product.variants.length > 0 
        ? product.variants[0].price 
        : product.price;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const inStock = product.quantity > 0 || product.status === 'in-stock' || product.inStock === true;
        const isLowStock = product.quantity > 0 && product.quantity < 10;
        
        let matchesAvailability = false;
        if (filters.availability.includes('in-stock') && inStock) matchesAvailability = true;
        if (filters.availability.includes('out-of-stock') && !inStock) matchesAvailability = true;
        if (filters.availability.includes('low-stock') && isLowStock) matchesAvailability = true;
        
        if (!matchesAvailability) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      const priceA = a.variants && a.variants.length > 0 ? a.variants[0].price : a.price;
      const priceB = b.variants && b.variants.length > 0 ? b.variants[0].price : b.price;
      
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters, sortBy, allProducts, searchQuery]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleAvailabilityToggle = (value: string) => {
    setFilters(prev => {
      const current = prev.availability;
      const newAvailability = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, availability: newAvailability };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 2000],
      availability: [],
    });
    setCurrentPage(1);
  };

  const getGridColsClass = () => {
    const desktopCols = gridCols.desktop === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
    const mobileCols = gridCols.mobile === 1 ? 'grid-cols-1' : 'grid-cols-2';
    return `grid ${mobileCols} md:grid-cols-3 ${desktopCols} gap-4`;
  };

  const hasActiveFilters = filters.category !== 'all' || 
    filters.priceRange[1] < 2000 || 
    filters.availability.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">Loading Products...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Banner Image with Text */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/bannerimage.png"
          alt="Products Banner"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 text-right">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 drop-shadow-lg">
            Our Products
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 drop-shadow-md">
            Discover our premium collection of organic jaggery products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Toolbar */}
        <div className="bg-transparent p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50/50 transition-colors font-medium text-sm"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {filters.availability.length + (filters.category !== 'all' ? 1 : 0) + (filters.priceRange[1] < 2000 ? 1 : 0)}
                  </span>
                )}
              </button>
              
              <p className="text-sm text-black font-medium">
                {filteredAndSortedProducts.length} products
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Grid View Toggle */}
              <div className="flex items-center gap-2">
                {/* Desktop Grid Options */}
                <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setGridCols(prev => ({ ...prev, desktop: 3 }))}
                    className={`p-2 rounded transition-colors ${
                      gridCols.desktop === 3 ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="3 columns"
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(prev => ({ ...prev, desktop: 4 }))}
                    className={`p-2 rounded transition-colors ${
                      gridCols.desktop === 4 ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="4 columns"
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile Grid Options */}
                <div className="flex lg:hidden items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setGridCols(prev => ({ ...prev, mobile: 1 }))}
                    className={`p-2 rounded transition-colors ${
                      gridCols.mobile === 1 ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="1 column"
                  >
                    <Squares2X2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(prev => ({ ...prev, mobile: 2 }))}
                    className={`p-2 rounded transition-colors ${
                      gridCols.mobile === 2 ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="2 columns"
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort" className="text-sm text-black font-medium whitespace-nowrap">
                  Sort:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 px-3 py-2 text-sm text-black focus:ring-2 focus:ring-[#F97316] focus:bg-white rounded-lg flex-1 sm:flex-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 focus:ring-2 focus:ring-[#F97316] focus:bg-white text-sm rounded-lg"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className={getGridColsClass()}>
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-sm font-medium rounded-lg"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 transition-colors text-sm font-medium rounded-lg ${
                      page === currentPage
                        ? 'bg-[#F97316] text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-sm font-medium rounded-lg"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more products.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-amber-600 text-white hover:bg-amber-700 transition-colors text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-transparent z-40"
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-16 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-sm z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="mb-6 pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Applied Filters:</h3>
                    <div className="flex flex-wrap gap-2">
                      {filters.category !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium">
                          {categories.find(c => c.value === filters.category)?.label}
                          <button
                            onClick={() => handleFilterChange('category', 'all')}
                            className="ml-1 hover:text-amber-900"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.priceRange[1] < 2000 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium">
                          Price: ₹0 - ₹{filters.priceRange[1]}
                          <button
                            onClick={() => handleFilterChange('priceRange', [0, 2000])}
                            className="ml-1 hover:text-amber-900"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.availability.map((avail) => (
                        <span key={avail} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium">
                          {availabilityOptions.find(o => o.value === avail)?.label}
                          <button
                            onClick={() => handleAvailabilityToggle(avail)}
                            className="ml-1 hover:text-amber-900"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={filters.category === category.value}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="mr-3 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowAvailability(!showAvailability)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
                    >
                      <span className="text-sm text-gray-700">
                        {filters.availability.length > 0 
                          ? `${filters.availability.length} selected`
                          : 'Select availability'}
                      </span>
                      <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${showAvailability ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAvailability && (
                      <div className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden">
                        {availabilityOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={filters.availability.includes(option.value)}
                              onChange={() => handleAvailabilityToggle(option.value)}
                              className="mr-3 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                            {filters.availability.includes(option.value) && (
                              <CheckIcon className="w-4 h-4 text-amber-600 ml-auto" />
                            )}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-3 px-4 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
