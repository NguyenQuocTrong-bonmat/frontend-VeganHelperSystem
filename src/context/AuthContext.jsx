import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAccessToken, storeAuthTokens, clearAuthTokens } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          // If token exists, fetch user profile to verify and load data
          const profile = await authService.getProfile();
          
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          clearAuthTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { rememberMe, ...apiCredentials } = credentials;
    const data = await authService.login(apiCredentials);
    storeAuthTokens(data, rememberMe);
    // Optionally fetch profile immediately after login
    const profile = await authService.getProfile();
    
    setUser(profile);
    setIsAuthenticated(true);
  };

  const loginWithGoogle = async (idToken) => {
    const data = await authService.googleLogin({ idToken });
    // Same as normal login but no "rememberMe" choice (default to localStorage)
    storeAuthTokens(data, true);
    const profile = await authService.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, loginWithGoogle, logout }}>
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
