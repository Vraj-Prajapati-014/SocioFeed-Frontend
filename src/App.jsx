import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTheme } from './store/slices/themeSlice';
import { getMeAsync } from './features/auth/slices/authSlice';
import ThemeContext from './utils/context/ThemeContext';
import { lightTheme, darkTheme } from './styles/theme';
import AppRoutes from './AppRoutes';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.mode);

  useEffect(() => {
    console.log('App.jsx: Dispatching getMeAsync');
    dispatch(getMeAsync());
  }, [dispatch]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') || 'light';
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme: themeMode, mode: themeMode }}>
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className={`min-h-screen ${themeMode === 'dark' ? 'dark' : ''}`}>
            <AppRoutes />
          </div>
        </ThemeProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;