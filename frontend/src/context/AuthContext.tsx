/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('homenest_token'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('homenest_username'));
  const [isLoading] = useState<boolean>(false);

  const login = (newToken: string, newUser: string) => {
    localStorage.setItem('homenest_token', newToken);
    localStorage.setItem('homenest_username', newUser);
    setToken(newToken);
    setUsername(newUser);
  };

  const logout = () => {
    localStorage.removeItem('homenest_token');
    localStorage.removeItem('homenest_username');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        username,
        token,
        isLoading,
        login,
        logout,
      }}
    >
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
