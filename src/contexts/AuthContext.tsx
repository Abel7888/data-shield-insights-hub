
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../lib/types';
import { getCurrentUser, getUserByUsername, setAuthToken, removeAuthToken, saveUser } from '../lib/storage';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is logged in on initial load
    const user = getCurrentUser();
    
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = getUserByUsername(username);
    
    if (user && user.password === password) {
      setAuthToken(user.id);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    removeAuthToken();
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    // Check if username already exists
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: '', // ID will be generated in saveUser
      username,
      password,
      isAdmin: false, // New registrations are not admins by default
    };
    
    const savedUser = saveUser(newUser);
    setAuthToken(savedUser.id);
    
    setAuthState({
      user: savedUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return true;
  };

  const value = {
    ...authState,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
