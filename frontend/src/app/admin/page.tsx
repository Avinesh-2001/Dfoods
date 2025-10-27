// admin-dashboard page.tsx (assuming this is the one for /admin/dashboard or similar)
'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null); // For CSV upload
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    ingredients: [''],
    productInfo: '',
    variants: [''],
    tags: [''],
    category: '',
    price: 0,
    originalPrice: 0,
    quantity: 0,
    images: [''],
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await adminApi.getUsers();
        setUsers(usersRes.data);
        const productsRes = await adminApi.getProducts();
        setProducts(productsRes.data);
        const contactsRes = await adminApi.getContacts();
        setContacts(contactsRes.data.contacts || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, router]);

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  field: keyof typeof productForm,
  index: number | null = null
) => {
  if (index !== null) {
    setProductForm(prev => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = e.target.value;
      return { ...prev, [field]: newArray };
    });
  } else {
    setProductForm(prev => ({ ...prev, [field]: e.target.value }));
  }
};


  const addArrayItem = (field) => {
    setProductForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setProductForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || !productForm.category || !productForm.price) {
      toast.error('Please fill all required fields (Name, SKU, Category, Price)');
      return;
    }
    const images = productForm.images.filter(img => img);
    if (images.length === 0) {
      toast.error('Please provide at least one image URL');
      return;
    }
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price) || 0,
        originalPrice: parseFloat(productForm.originalPrice) || undefined,
        quantity: parseInt(productForm.quantity) || 0,
        images,
        ingredients: productForm.ingredients.filter(i => i) || undefined,
        variants: productForm.variants.filter(v => v) || undefined,
        tags: productForm.tags.filter(t => t) || undefined,
      };

      if (editingProductId) {
        await adminApi.updateProduct(editingProductId, productData);
        setProducts(products.map(p => (p._id === editingProductId ? { ...p, ...productData } : p)));
        toast.success('Product updated successfully!');
      } else {
        const res = await adminApi.createProduct(productData);
        setProducts([...products, res.data]);
        toast.success('Product created successfully!');
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save product:', err, err.response?.data);
      toast.error(`Failed to save product: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setFile(e.target.files[0]);
  }
};


  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      return;
    }
    
    const loadingToast = toast.loading('Uploading products...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await adminApi.uploadProducts(formData);
      
      toast.dismiss(loadingToast);
      
      // Show success message with duplicate info
      let successMessage = `🎉 Success! ${res.data.count} new product${res.data.count > 1 ? 's' : ''} uploaded!`;
      if (res.data.duplicates > 0) {
        successMessage += ` (${res.data.duplicates} duplicate${res.data.duplicates > 1 ? 's' : ''} skipped)`;
      }
      
      toast.success(successMessage, { duration: 5000 });
      
      // Refresh products
      const productsRes = await adminApi.getProducts();
      setProducts(productsRes.data);
      setFile(null);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      toast.dismiss(loadingToast);
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || err.response?.data?.message || 'Failed to upload CSV';
      toast.error(`Upload failed: ${errorMsg}`, { duration: 6000 });
    }
  };

  const handleEdit = (product) => {
    setProductForm({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      ingredients: product.ingredients || [''],
      productInfo: product.productInfo || '',
      variants: product.variants || [''],
      tags: product.tags || [''],
      category: product.category || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      quantity: product.quantity,
      images: product.images || [''],
    });
    setEditingProductId(product._id);
    setShowProductForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminApi.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      sku: '',
      description: '',
      ingredients: [''],
      productInfo: '',
      variants: [''],
      tags: [''],
      category: '',
      price: 0,
      originalPrice: 0,
      quantity: 0,
      images: [''],
    });
    setEditingProductId(null);
    setShowProductForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#8B4513] mb-6">Admin Dashboard</h1>

      {/* Users Section */}
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Registered Users</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users registered yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FDF6E3]">
                <th className="border p-3 text-left text-[#8B4513]">Name</th>
                <th className="border p-3 text-left text-[#8B4513]">Email</th>
                <th className="border p-3 text-left text-[#8B4513]">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border p-3 text-[#8B4513]">{user.name}</td>
                  <td className="border p-3 text-[#8B4513]">{user.email}</td>
                  <td className="border p-3 text-[#8B4513]">{user.isBlocked ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Contact Submissions Section */}
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">📧 Contact Form Submissions</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {loading ? (
          <p className="text-gray-600">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <p className="text-gray-600">No contact submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FDF6E3]">
                  <th className="border p-3 text-left text-[#8B4513]">Name</th>
                  <th className="border p-3 text-left text-[#8B4513]">Email</th>
                  <th className="border p-3 text-left text-[#8B4513]">Phone</th>
                  <th className="border p-3 text-left text-[#8B4513]">Message</th>
                  <th className="border p-3 text-left text-[#8B4513]">Date</th>
                  <th className="border p-3 text-left text-[#8B4513]">Status</th>
                  <th className="border p-3 text-left text-[#8B4513]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className={contact.status === 'new' ? 'bg-orange-50' : ''}>
                    <td className="border p-3 text-[#8B4513]">{contact.name}</td>
                    <td className="border p-3 text-[#8B4513]">
                      <a href={`mailto:${contact.email}`} className="text-[#E67E22] hover:underline">
                        {contact.email}
                      </a>
                    </td>
                    <td className="border p-3 text-[#8B4513]">{contact.phone || 'N/A'}</td>
                    <td className="border p-3 text-[#8B4513] max-w-xs truncate">{contact.message}</td>
                    <td className="border p-3 text-[#8B4513] text-sm">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border p-3 text-[#8B4513]">
                      <select
                        value={contact.status}
                        onChange={async (e) => {
                          try {
                            await adminApi.updateContactStatus(contact._id, e.target.value);
                            setContacts(contacts.map(c => 
                              c._id === contact._id ? { ...c, status: e.target.value } : c
                            ));
                            toast.success('Status updated!');
                          } catch (err) {
                            toast.error('Failed to update status');
                          }
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="border p-3 text-[#8B4513]">
                      <button
                        onClick={async () => {
                          if (confirm('Delete this contact submission?')) {
                            try {
                              await adminApi.deleteContact(contact._id);
                              setContacts(contacts.filter(c => c._id !== contact._id));
                              toast.success('Contact deleted!');
                            } catch (err) {
                              toast.error('Failed to delete');
                            }
                          }
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Products Section */}
      <h2 className="text-xl font-semibold text-[#8B4513] mb-4">Manage Products</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <button
          onClick={() => setShowProductForm(!showProductForm)}
          className="mb-4 px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400]"
        >
          {showProductForm ? 'Cancel' : 'Add New Product'}
        </button>

        {/* CSV Upload */}
        <div className="mb-6 p-4 bg-[#FDF6E3] rounded-lg border border-[#E67E22]">
          <h3 className="text-lg font-semibold text-[#8B4513] mb-2">📤 Bulk Upload Products via CSV</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload multiple products at once using a CSV file. 
            <a href="/sample-products.csv" download className="text-[#E67E22] hover:underline ml-1">
              Download sample CSV template
            </a>
          </p>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
            />
            <button
              onClick={handleUpload}
              disabled={!file}
              className="px-6 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Upload CSV
            </button>
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2">✓ Selected: {file.name}</p>
          )}
        </div>

        {showProductForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-[#8B4513]">Name</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => handleInputChange(e, 'name')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">SKU</label>
              <input
                type="text"
                value={productForm.sku}
                onChange={(e) => handleInputChange(e, 'sku')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => handleInputChange(e, 'description')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Product Info</label>
              <textarea
                value={productForm.productInfo}
                onChange={(e) => handleInputChange(e, 'productInfo')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Category</label>
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => handleInputChange(e, 'category')}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Price</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => handleInputChange(e, 'price')}
                className="w-full p-2 border rounded"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Original Price (optional)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => handleInputChange(e, 'originalPrice')}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block text-[#8B4513]">Quantity</label>
              <input
                type="number"
                value={productForm.quantity}
                onChange={(e) => handleInputChange(e, 'quantity')}
                className="w-full p-2 border rounded"
                required
                min="0"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-[#8B4513]">Images</label>
              {productForm.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleInputChange(e, 'images', index)}
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                    required
                  />
                  {productForm.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('images', index)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="px-2 py-1 bg-[#E67E22] text-white rounded"
              >
                Add Image
              </button>
            </div>

            {/* Array fields */}
            {['ingredients', 'variants', 'tags'].map((field) => (
              <div key={field}>
                <label className="block text-[#8B4513] capitalize">{field}</label>
                {productForm[field].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleInputChange(e, field, index)}
                      className="w-full p-2 border rounded"
                      placeholder={field.slice(0, -1)}
                    />
                    {productForm[field].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field, index)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem(field)}
                  className="px-2 py-1 bg-[#E67E22] text-white rounded"
                >
                  Add {field.slice(0, -1)}
                </button>
              </div>
            ))}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D35400]"
            >
              {editingProductId ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#FDF6E3]">
                <th className="border p-3 text-left text-[#8B4513]">Name</th>
                <th className="border p-3 text-left text-[#8B4513]">Price</th>
                <th className="border p-3 text-left text-[#8B4513]">Quantity</th>
                <th className="border p-3 text-left text-[#8B4513]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border p-3 text-[#8B4513]">{product.name}</td>
                  <td className="border p-3 text-[#8B4513]">₹{product.price}</td>
                  <td className="border p-3 text-[#8B4513]">{product.quantity}</td>
                  <td className="border p-3 text-[#8B4513]">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}