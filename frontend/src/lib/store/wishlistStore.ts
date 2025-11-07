import { create } from 'zustand';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getWishlistBaseEndpoint = () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
  if (API_BASE.includes('/api')) {
    return `${API_BASE}/wishlist`;
  }
  return `${API_BASE}/api/wishlist`;
};

interface WishlistStore {
  items: any[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  initialized: false,
  error: null,
  fetchWishlist: async () => {
    if (get().loading) return;

    const token = getAuthToken();
    if (!token) {
      set({ items: [], initialized: true, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(getWishlistBaseEndpoint(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      set({
        items: Array.isArray(data.products) ? data.products : [],
        loading: false,
        initialized: true,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        initialized: true,
        error: error.message || 'Failed to fetch wishlist',
      });
    }
  },
  addToWishlist: async (productId: string) => {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${getWishlistBaseEndpoint()}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      set({
        items: Array.isArray(data.products) ? data.products : [],
        initialized: true,
        error: null,
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  removeFromWishlist: async (productId: string) => {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${getWishlistBaseEndpoint()}/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      set({
        items: Array.isArray(data.products) ? data.products : [],
        initialized: true,
        error: null,
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  clearWishlist: () => {
    set({ items: [], loading: false, initialized: false, error: null });
  },
  isInWishlist: (productId: string) => {
    return get().items.some((item) => (item._id || item.id) === productId);
  },
}));
