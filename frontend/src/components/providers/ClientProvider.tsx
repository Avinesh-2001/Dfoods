'use client';

import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store, { setUser } from '../../store';
import toast, { Toaster } from 'react-hot-toast';

interface ClientProviderProps {
  children: React.ReactNode;
}

// Component to restore user from localStorage on mount
function UserStateRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    // Restore user state from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(setUser({ user, token }));
        } catch (e) {
          console.error('Failed to restore user state:', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsRestored(true);
    }
  }, [dispatch]);

  if (!isRestored) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white font-bold">D</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F97316]">Dfoods</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <UserStateRestorer>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#F97316',
              color: '#fff',
            },
          }}
        />
      </UserStateRestorer>
    </Provider>
  );
}
