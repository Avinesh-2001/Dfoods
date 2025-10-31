'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/api';
import {
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in-progress' | 'resolved'>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await adminApi.getContacts();
      const list = response.data?.contacts || response.data || [];
      setContacts(list);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'new' | 'in-progress' | 'resolved') => {
    try {
      await adminApi.updateContactStatus(id, status);
      setContacts(prev => prev.map(c => (c._id === id ? { ...c, status } : c)));
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const filtered = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (c.status || 'new') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600">View and manage customer inquiries</p>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-amber-600" />
          {contacts.length} total
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((c) => (
          <div key={c._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{c.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    (c.status || 'new') === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : (c.status || 'new') === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {c.status || 'new'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="mr-4">{c.email}</span>
                  {c.phone && <span>{c.phone}</span>}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{c.message}</p>
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {(c.status || 'new') !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'resolved')}
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark Resolved
                  </button>
                )}
                {(c.status || 'new') !== 'in-progress' && (c.status || 'new') !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(c._id, 'in-progress')}
                    className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    In Progress
                  </button>
                )}
                <button
                  onClick={() => handleDelete(c._id)}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No contacts found</div>
        </div>
      )}
    </div>
  );
}


