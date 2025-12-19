import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const storedUser = localStorage.getItem('fitlog_user');
    const storedToken = localStorage.getItem('fitlog_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // For demo, we'll create a mock user
      const mockUser = {
        id: 1,
        email,
        name: email.split('@')[0],
        avatar: '👤',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          weightUnit: 'kg',
          measurementSystem: 'metric'
        }
      };

      // Generate mock token
      const token = btoa(`${email}:${Date.now()}`);
      
      // Store in localStorage
      localStorage.setItem('fitlog_user', JSON.stringify(mockUser));
      localStorage.setItem('fitlog_token', token);
      
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email, password, name) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('fitlog_users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        email,
        name: name || email.split('@')[0],
        avatar: '👤',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          weightUnit: 'kg',
          measurementSystem: 'metric'
        }
      };

      // Store user in local storage
      existingUsers.push({ email, password: btoa(password) }); // Simple encoding for demo
      localStorage.setItem('fitlog_users', JSON.stringify(existingUsers));

      // Generate token and login
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('fitlog_user', JSON.stringify(newUser));
      localStorage.setItem('fitlog_token', token);
      
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('fitlog_user');
    localStorage.removeItem('fitlog_token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const currentUser = { ...user, ...updatedUser };
    localStorage.setItem('fitlog_user', JSON.stringify(currentUser));
    setUser(currentUser);
  };

  const updatePreferences = (preferences) => {
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    };
    localStorage.setItem('fitlog_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const changePassword = async (currentPassword, newPassword) => {
    // In a real app, this would verify with backend
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout, 
      register,
      updateUser,
      updatePreferences,
      changePassword,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};