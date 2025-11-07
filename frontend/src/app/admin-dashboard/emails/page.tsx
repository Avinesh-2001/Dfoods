'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/api';
import {
  EnvelopeIcon,
  PencilIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface EmailTemplate {
  _id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  isActive: boolean;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

const emailCategories = [
  {
    name: 'Account / User Emails',
    icon: '👤',
    templates: [
      { name: 'Create Account', key: 'create_account', description: 'Sent when user creates account' },
      { name: 'OTP Verification', key: 'otp_verification', description: 'Sent for OTP verification' },
      { name: 'Welcome Email', key: 'welcome_email', description: 'Sent after successful account creation' },
      { name: 'Forgot Password', key: 'forgot_password', description: 'Sent when user requests password reset' }
    ]
  },
  {
    name: 'Discount / Marketing Emails',
    icon: '🎯',
    templates: [
      { name: 'Discount Notification', key: 'discount_notification', description: 'Sent to selected members about discounts' },
      { name: 'Greeting Shopping Again', key: 'greeting_shopping', description: 'Welcome back email for returning customers' }
    ]
  },
  {
    name: 'Checkout / Order Emails',
    icon: '🛒',
    templates: [
      { name: 'Checkout Pending', key: 'checkout_pending', description: 'Sent when checkout is pending' },
      { name: 'Payment Success', key: 'payment_success', description: 'Sent after successful payment' },
      { name: 'Order Confirmation', key: 'order_confirmation', description: 'Sent after order is confirmed' },
      { name: 'Order Invoice', key: 'order_invoice', description: 'Sent with order invoice PDF' },
      { name: 'Order Edited', key: 'order_edited', description: 'Sent when order is modified' },
      { name: 'Order Canceled', key: 'order_canceled', description: 'Sent when order is canceled' }
    ]
  },
  {
    name: 'Shipping Emails',
    icon: '🚚',
    templates: [
      { name: 'Shipping Confirmation', key: 'shipping_confirmation', description: 'Sent when order is shipped' },
      { name: 'Pick Up Order', key: 'pickup_order', description: 'Sent for pickup orders' },
      { name: 'Out for Delivery', key: 'out_for_delivery', description: 'Sent when order is out for delivery' },
      { name: 'Delivered Order', key: 'delivered_order', description: 'Sent when order is delivered' },
      { name: 'Shipping Updated', key: 'shipping_updated', description: 'Sent when shipping status is updated' }
    ]
  },
  {
    name: 'Payment Emails',
    icon: '💳',
    templates: [
      { name: 'Payment Error', key: 'payment_error', description: 'Sent when payment fails' },
      { name: 'Payment Success', key: 'payment_success', description: 'Sent after successful payment' },
      { name: 'Payment Reminder', key: 'payment_reminder', description: 'Sent as payment reminder' }
    ]
  },
  {
    name: 'Return Emails',
    icon: '↩️',
    templates: [
      { name: 'Return Created', key: 'return_created', description: 'Sent when return is created' },
      { name: 'Return Received', key: 'return_received', description: 'Sent when return is received' },
      { name: 'Return Approved', key: 'return_approved', description: 'Sent when return is approved' },
      { name: 'Return Declined', key: 'return_declined', description: 'Sent when return is declined' }
    ]
  }
];

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function EmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [showPromotionalModal, setShowPromotionalModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [promotionalForm, setPromotionalForm] = useState({
    subject: '',
    content: '',
    recipientType: 'all',
    recipientEmails: [] as string[]
  });
  const [editForm, setEditForm] = useState({
    name: '',
    subject: '',
    content: '',
    isActive: true,
    variables: [] as string[]
  });

  useEffect(() => {
    fetchTemplates();
    fetchUsers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await adminApi.getEmailTemplates();
      setTemplates(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/emails/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data || []);
    } catch (error) {
      // Silent fail
    }
  };

  const handleSendPromotionalEmail = async () => {
    if (!promotionalForm.subject || !promotionalForm.content) {
      toast.error('Subject and content are required');
      return;
    }

    if (promotionalForm.recipientType === 'selected' && promotionalForm.recipientEmails.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/emails/send-promotional`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(promotionalForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Promotional emails sent successfully! (${data.success}/${data.total})`);
        setShowPromotionalModal(false);
        setPromotionalForm({
          subject: '',
          content: '',
          recipientType: 'all',
          recipientEmails: []
        });
      } else {
        toast.error(data.error || 'Failed to send promotional emails');
      }
    } catch (error) {
      toast.error('Failed to send promotional emails');
    }
  };

  const handleToggleRecipient = (email: string) => {
    setPromotionalForm(prev => ({
      ...prev,
      recipientEmails: prev.recipientEmails.includes(email)
        ? prev.recipientEmails.filter(e => e !== email)
        : [...prev.recipientEmails, email]
    }));
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setEditForm({
      name: template.name,
      subject: template.subject,
      content: template.content,
      isActive: template.isActive,
      variables: template.variables || []
    });
    setShowEditModal(true);
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;

    try {
      await adminApi.updateEmailTemplate(editingTemplate._id, editForm);
      toast.success('Email template updated successfully!');
      setShowEditModal(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      console.error('Error updating template:', error);
      toast.error(error.response?.data?.message || 'Failed to update template');
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      await adminApi.updateEmailTemplate(template._id, { isActive: !template.isActive });
      toast.success(`Template ${!template.isActive ? 'activated' : 'deactivated'} successfully!`);
      fetchTemplates();
    } catch (error: any) {
      console.error('Error toggling template:', error);
      toast.error('Failed to update template status');
    }
  };
  

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryTemplates = (categoryName: string) => {
    const category = emailCategories.find(cat => cat.name === categoryName);
    if (!category) return [];
    
    return category.templates.map(template => {
      const existingTemplate = templates.find(t => t.name === template.name);
      return {
        ...template,
        ...existingTemplate,
        exists: !!existingTemplate
      };
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Manage email notifications and templates</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowPromotionalModal(true)}
            className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Send Promotional Email
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
                placeholder="Search templates..."
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
            <option value="all">All Categories</option>
            {emailCategories.map(category => (
              <option key={category.name} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Email Categories */}
      {emailCategories.map((category) => (
        <div key={category.name} className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">{category.icon}</span>
              {category.name}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCategoryTemplates(category.name).map((template) => (
                <div key={template.key} className={`border rounded-lg p-4 ${
                  template.exists ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex space-x-1">
                      {template.exists && (
                        <>
                          <button
                            onClick={() => handlePreviewTemplate(template as EmailTemplate)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Preview"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template as EmailTemplate)}
                            className="p-1 text-amber-600 hover:text-amber-800"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(template as EmailTemplate)}
                            className={`p-1 ${template.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                            title={template.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {template.isActive ? <CheckIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  {template.exists ? (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Subject:</span> {template.subject}
        </div>
                      <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          template.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Template not created yet
                  </div>
                  )}
                </div>
              ))}
                </div>
              </div>
            </div>
          ))}

      {/* Edit Template Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Email Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={10}
                  placeholder="Enter email content. Use variables like {{user_name}}, {{order_id}}, etc."
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active Template
                </label>
        </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTemplate}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Update Template
                </button>
      </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-4">
                <strong>Subject:</strong> {previewTemplate.subject}
              </div>
              <div className="whitespace-pre-wrap">
                {previewTemplate.content}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Email Modal */}
      {showPromotionalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">📧 Send Promotional Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={promotionalForm.subject}
                  onChange={(e) => setPromotionalForm({...promotionalForm, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Special 20% Off on All Products!"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Content (HTML supported)
                </label>
                <textarea
                  value={promotionalForm.content}
                  onChange={(e) => setPromotionalForm({...promotionalForm, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={10}
                  placeholder="Enter your promotional email content. You can use {{name}} to personalize."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use {"{{name}}"} to insert customer names. The email will be wrapped with company logo and footer automatically.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipientType"
                      checked={promotionalForm.recipientType === 'all'}
                      onChange={() => setPromotionalForm({...promotionalForm, recipientType: 'all'})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm">Send to all users ({users.length} users)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipientType"
                      checked={promotionalForm.recipientType === 'selected'}
                      onChange={() => setPromotionalForm({...promotionalForm, recipientType: 'selected'})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm">Send to selected users</span>
                  </label>
                </div>
              </div>

              {promotionalForm.recipientType === 'selected' && (
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Select Users ({promotionalForm.recipientEmails.length} selected)
                  </p>
                  <div className="space-y-2">
                    {users.map(user => (
                      <label key={user._id} className="flex items-center py-1">
                        <input
                          type="checkbox"
                          checked={promotionalForm.recipientEmails.includes(user.email)}
                          onChange={() => handleToggleRecipient(user.email)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <span className="ml-2 text-sm">{user.name} ({user.email})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowPromotionalModal(false);
                    setPromotionalForm({
                      subject: '',
                      content: '',
                      recipientType: 'all',
                      recipientEmails: []
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendPromotionalEmail}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}