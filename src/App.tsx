import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useAuthStore } from './store/authStore';
import { useWalletStore } from './store/walletStore';
import { useThemeStore } from './store/themeStore';

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();
  const { fetchWalletData } = useWalletStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    checkAuth();
    fetchWalletData();
  }, [initTheme, checkAuth, fetchWalletData]);

  return <RouterProvider router={router} />;
};

export default App;
