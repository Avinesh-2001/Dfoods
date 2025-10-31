'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/api';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProductVariant {
  size: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  ingredients: string[];
  productInfo: string;
  variants: ProductVariant[];
  tags: string[];
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  quantity: number;
  status: 'in-stock' | 'out-of-stock' | 'limited';
  inStock: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    sku: '',
    description: '',
    ingredients: [''],
    productInfo: '',
    variants: [{ size: '', price: 0 }],
    tags: [''],
    category: '',
    price: '',
    originalPrice: '',
    images: [''],
    quantity: '',
    status: 'in-stock' as 'in-stock' | 'out-of-stock' | 'limited'
  });

  const [addForm, setAddForm] = useState({
    name: '',
    sku: '',
    description: '',
    ingredients: [''],
    productInfo: '',
    variants: [{ size: '', price: 0 }],
    tags: [''],
    category: '',
    price: '',
    originalPrice: '',
    images: [''],
    quantity: '',
    status: 'in-stock' as 'in-stock' | 'out-of-stock' | 'limited'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Please login as admin to view products');
      setLoading(false);
      return;
    }

    try {
      const response = await adminApi.getProducts({});
      setProducts(response.data.products || response.data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        window.location.href = '/admin-login';
      } else {
        toast.error('Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Please login as admin to upload CSV');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await adminApi.uploadProducts(formData);
      
      // Show success message with duplicate info
      let successMessage = `🎉 Success! ${response.data.count} new product${response.data.count > 1 ? 's' : ''} uploaded!`;
      if (response.data.duplicates > 0) {
        successMessage += ` (${response.data.duplicates} duplicate${response.data.duplicates > 1 ? 's' : ''} skipped)`;
      }
      
      toast.success(successMessage);
      setShowCSVUpload(false);
      setCsvFile(null);
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        window.location.href = '/admin-login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload CSV');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      ingredients: product.ingredients && product.ingredients.length > 0 ? product.ingredients : [''],
      productInfo: product.productInfo || '',
      variants: product.variants && product.variants.length > 0 ? product.variants : [{ size: '', price: 0 }],
      tags: product.tags && product.tags.length > 0 ? product.tags : [''],
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      quantity: product.quantity?.toString() || '',
      status: product.status || 'in-stock'
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Please login as admin to update products');
      return;
    }

    try {
      const updateData = {
        ...editForm,
        price: parseFloat(editForm.price),
        originalPrice: editForm.originalPrice ? parseFloat(editForm.originalPrice) : undefined,
        quantity: parseInt(editForm.quantity) || 0,
        ingredients: editForm.ingredients.filter(ing => ing.trim() !== ''),
        variants: editForm.variants.filter(v => v.size.trim() !== '' && v.price > 0),
        tags: editForm.tags.filter(tag => tag.trim() !== ''),
        images: editForm.images.filter(img => img.trim() !== '')
      };

      await adminApi.updateProduct(editingProduct._id, updateData);
      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        // Optionally redirect to admin login
        window.location.href = '/admin-login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to update product');
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Please login as admin to delete products');
      return;
    }

    try {
      await adminApi.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
        window.location.href = '/admin-login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // Helper functions for managing arrays
  const addArrayItem = (field: 'ingredients' | 'tags' | 'images') => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'ingredients' | 'tags' | 'images', index: number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'ingredients' | 'tags' | 'images', index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Variant management functions
  const addVariant = () => {
    setEditForm(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', price: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: 'size' | 'price', value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['name', 'price', 'category', 'description', 'inStock', 'quantity'],
      ['Organic Jaggery', '299', 'Jaggery', 'Pure organic jaggery', 'true', '100'],
      ['Coconut Jaggery', '199', 'Jaggery', 'Coconut jaggery cubes', 'true', '50'],
      ['Palm Jaggery', '249', 'Jaggery', 'Palm jaggery powder', 'true', '75']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'jaggery-cubes', 'jaggery-powder', 'plain-jaggery', 'flavored-jaggery'];

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowCSVUpload(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload CSV
          </button>
          <button 
            onClick={downloadSampleCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Sample CSV
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit Product"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Product"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No products found</div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Products CSV</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">CSV Format:</p>
                <p>name, price, category, description, inStock, quantity</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCSVUpload(false);
                    setCsvFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCSVUpload}
                  disabled={!csvFile || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Product - {editForm.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={editForm.sku}
                    onChange={(e) => setEditForm({...editForm, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Information
                  </label>
                  <textarea
                    value={editForm.productInfo}
                    onChange={(e) => setEditForm({...editForm, productInfo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Pricing & Inventory</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({...editForm, originalPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value as 'in-stock' | 'out-of-stock' | 'limited'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="limited">Limited Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Product Variants</h4>
                <button
                  onClick={addVariant}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {editForm.variants.map((variant, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder="e.g., 250g, 500g, 1kg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    {editForm.variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Ingredients</h4>
                <button
                  onClick={() => addArrayItem('ingredients')}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Add Ingredient
                </button>
              </div>
              <div className="space-y-2">
                {editForm.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateArrayItem('ingredients', index, e.target.value)}
                      placeholder="Enter ingredient"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {editForm.ingredients.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('ingredients', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Tags</h4>
                <button
                  onClick={() => addArrayItem('tags')}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Add Tag
                </button>
              </div>
              <div className="space-y-2">
                {editForm.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                      placeholder="Enter tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {editForm.tags.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('tags', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Images</h4>
                <button
                  onClick={() => addArrayItem('images')}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Add Image
                </button>
              </div>
              <div className="space-y-2">
                {editForm.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateArrayItem('images', index, e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {editForm.images.length > 1 && (
                      <button
                        onClick={() => removeArrayItem('images', index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={addForm.sku}
                    onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Information</label>
                  <textarea
                    value={addForm.productInfo}
                    onChange={(e) => setAddForm({ ...addForm, productInfo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Pricing & Inventory</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={addForm.originalPrice}
                    onChange={(e) => setAddForm({ ...addForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={addForm.quantity}
                    onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value as 'in-stock' | 'out-of-stock' | 'limited' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="limited">Limited Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Product Variants</h4>
                <button
                  onClick={() => setAddForm(prev => ({ ...prev, variants: [...prev.variants, { size: '', price: 0 }] }))}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {addForm.variants.map((variant, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                      <input
                        type="text"
                        value={variant.size}
                        onChange={(e) => setAddForm(prev => ({ ...prev, variants: prev.variants.map((v, i) => i === index ? { ...v, size: e.target.value } : v) }))}
                        placeholder="e.g., 250g, 500g, 1kg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => setAddForm(prev => ({ ...prev, variants: prev.variants.map((v, i) => i === index ? { ...v, price: parseFloat(e.target.value) || 0 } : v) }))}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    {addForm.variants.length > 1 && (
                      <button
                        onClick={() => setAddForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }))}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Ingredients</h4>
                <button
                  onClick={() => setAddForm(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }))}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Add Ingredient
                </button>
              </div>
              <div className="space-y-2">
                {addForm.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => setAddForm(prev => ({ ...prev, ingredients: prev.ingredients.map((ing, i) => i === index ? e.target.value : ing) }))}
                      placeholder="Enter ingredient"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {addForm.ingredients.length > 1 && (
                      <button
                        onClick={() => setAddForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }))}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Tags</h4>
                <button
                  onClick={() => setAddForm(prev => ({ ...prev, tags: [...prev.tags, ''] }))}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  Add Tag
                </button>
              </div>
              <div className="space-y-2">
                {addForm.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setAddForm(prev => ({ ...prev, tags: prev.tags.map((t, i) => i === index ? e.target.value : t) }))}
                      placeholder="Enter tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {addForm.tags.length > 1 && (
                      <button
                        onClick={() => setAddForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Images</h4>
                <button
                  onClick={() => setAddForm(prev => ({ ...prev, images: [...prev.images, ''] }))}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Add Image
                </button>
              </div>
              <div className="space-y-2">
                {addForm.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setAddForm(prev => ({ ...prev, images: prev.images.map((img, i) => i === index ? e.target.value : img) }))}
                      placeholder="Enter image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {addForm.images.length > 1 && (
                      <button
                        onClick={() => setAddForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddForm({
                    name: '', sku: '', description: '', ingredients: [''], productInfo: '',
                    variants: [{ size: '', price: 0 }], tags: [''], category: '', price: '', originalPrice: '', images: [''], quantity: '', status: 'in-stock'
                  });
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const adminToken = localStorage.getItem('adminToken');
                  if (!adminToken) {
                    toast.error('Please login as admin to add products');
                    return;
                  }
                  try {
                    const data = {
                      ...addForm,
                      price: parseFloat(addForm.price),
                      originalPrice: addForm.originalPrice ? parseFloat(addForm.originalPrice) : undefined,
                      quantity: parseInt(addForm.quantity) || 0,
                      ingredients: addForm.ingredients.filter(ing => ing.trim() !== ''),
                      variants: addForm.variants.filter(v => v.size.trim() !== '' && v.price > 0),
                      tags: addForm.tags.filter(tag => tag.trim() !== ''),
                      images: addForm.images.filter(img => img.trim() !== '')
                    };
                    await adminApi.createProduct(data as any);
                    toast.success('Product created successfully!');
                    setShowAddModal(false);
                    setAddForm({
                      name: '', sku: '', description: '', ingredients: [''], productInfo: '',
                      variants: [{ size: '', price: 0 }], tags: [''], category: '', price: '', originalPrice: '', images: [''], quantity: '', status: 'in-stock'
                    });
                    fetchProducts();
                  } catch (error: any) {
                    console.error('Error creating product:', error);
                    toast.error(error.response?.data?.message || 'Failed to create product');
                  }
                }}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
