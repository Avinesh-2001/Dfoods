'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../../store';
import toast, { Toaster } from 'react-hot-toast';

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#E67E22] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">D</span>
          </div>
          <h1 className="text-2xl font-bold text-[#8B4513]">Dfoods</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#E67E22',
            color: '#fff',
          },
        }}
      />
    </Provider>
  );
}