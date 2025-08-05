'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('synapseiq_admin_auth');
        const storedToken = localStorage.getItem('token');
        
        if (authData) {
          const { isAuthenticated, user, timestamp } = JSON.parse(authData);
          
          // Check if the auth is still valid (24 hour expiry)
          const authTime = new Date(timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - authTime) / (1000 * 60 * 60);
          
          if (isAuthenticated && hoursDiff < 24 && storedToken) {
            setIsAuthenticated(true);
            setUser(user);
            setToken(storedToken);
          } else {
            // Auth expired
            localStorage.removeItem('synapseiq_admin_auth');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('synapseiq_admin_auth');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Protect admin routes
  useEffect(() => {
    if (!loading) {
      // If trying to access admin pages without auth, redirect to login
      if (pathname?.startsWith('/admin') && 
          pathname !== '/admin/login' && 
          !isAuthenticated) {
        router.push('/admin/login');
      }
      
      // If already authenticated and trying to access login page, redirect to admin
      if (pathname === '/admin/login' && isAuthenticated) {
        router.push('/admin');
      }
    }
  }, [pathname, isAuthenticated, loading, router]);

  const getAuthHeader = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // For demo purposes - replace with actual authentication
      if (username === 'admin' && password === 'admin123') {
        // Generate a simple token (in a real app, this would come from the backend)
        const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoxNjkwMDg2NDAwfQ.8y7gaQYw2VfyOQDUwN8bO5-vVYL55-74D0MzImgJGS0';
        
        // Store authentication state
        const authData = {
          isAuthenticated: true,
          user: username,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('synapseiq_admin_auth', JSON.stringify(authData));
        localStorage.setItem('token', demoToken);
        setIsAuthenticated(true);
        setUser(username);
        setToken(demoToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('synapseiq_admin_auth');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
