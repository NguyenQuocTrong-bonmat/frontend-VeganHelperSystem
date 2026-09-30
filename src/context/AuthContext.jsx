import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        try {
          // If token exists, fetch user profile to verify and load data
          const profile = await authService.getProfile();
          
          // Decode JWT to get role
          let role = 'member';
          try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'member';
          } catch(e) {}
          
          setUser({ ...profile, role });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const { rememberMe, ...apiCredentials } = credentials;
    const data = await authService.login(apiCredentials);
    // Assuming backend returns { accessToken: "..." }
    if (rememberMe) {
      localStorage.setItem('accessToken', data.accessToken);
    } else {
      sessionStorage.setItem('accessToken', data.accessToken);
    }
    setIsAuthenticated(true);
    
    // Optionally fetch profile immediately after login
    const profile = await authService.getProfile();
    
    // Decode JWT to get role
    let role = 'member';
    try {
      const decoded = JSON.parse(atob(data.accessToken.split('.')[1]));
      role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'member';
    } catch(e) {}
    
    setUser({ ...profile, role });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
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
