import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAccessToken, storeAuthTokens, clearAuthTokens } from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const parseRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      const rawRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;
      if (!rawRole) return null;
      return rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          // If token exists, fetch user profile to verify and load data
          const profile = await authService.getProfile();
          const role = parseRoleFromToken(token);
          
          setUser({ ...profile, role });
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
    const role = parseRoleFromToken(data.accessToken);
    
    setUser({ ...profile, role });
    setIsAuthenticated(true);
  };

  const loginWithGoogle = async (idToken) => {
    const data = await authService.googleLogin({ idToken });
    // Same as normal login but no "rememberMe" choice (default to localStorage)
    storeAuthTokens(data, true);
    const profile = await authService.getProfile();
    const role = parseRoleFromToken(data.accessToken);

    setUser({ ...profile, role });
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
