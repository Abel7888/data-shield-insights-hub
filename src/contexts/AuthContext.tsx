
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getUserByUsername } from '@/lib/services/userService';
import { setAuthToken, removeAuthToken, getCurrentUser, isLocallyAuthenticated } from '@/lib/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing authentication...");
        
        // Check if we have a valid local token first (simplest approach)
        if (isLocallyAuthenticated()) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          console.log("User authenticated locally:", currentUser);
          setIsLoading(false);
          return;
        }
        
        // Get current Supabase session as fallback
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Found existing Supabase session');
          setSession(currentSession);
          setUser({
            id: currentSession.user.id,
            username: currentSession.user.email || 'user',
            password: '',
            isAdmin: true
          });
        } else {
          // Last resort: check for any valid custom auth
          console.log('No Supabase session, checking for custom auth');
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting to login with username:', username);
      
      // Simple admin login check
      if (username === 'admin' && password === 'admin123') {
        console.log('Admin login successful');
        const adminUser = {
          id: 'admin-user-id',
          username: 'admin',
          password: 'admin123',
          isAdmin: true
        };
        setUser(adminUser);
        setAuthToken(adminUser.id);
        
        toast({
          title: "Login successful",
          description: "Welcome back, admin!"
        });
        return true;
      }
      
      // Try Supabase login as fallback
      if (username.includes('@')) {
        console.log('Email login detected, trying Supabase auth');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password
        });
        
        if (data.session) {
          console.log('Supabase login successful');
          setSession(data.session);
          setUser({
            id: data.user.id,
            username: data.user.email || 'user',
            password: '',
            isAdmin: true
          });
          toast({
            title: "Login successful",
            description: `Welcome back!`
          });
          return true;
        }
        
        if (error) {
          console.log('Supabase login failed:', error.message);
        }
      }
      
      // Check custom users as last resort
      const foundUser = await getUserByUsername(username);
      
      if (foundUser && foundUser.password === password) {
        console.log('Custom login successful for user:', foundUser);
        setUser(foundUser);
        setAuthToken(foundUser.id);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.username}!`
        });
        return true;
      }
      
      console.log('Login failed: Invalid credentials');
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase first
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      removeAuthToken();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout error",
        description: "An error occurred during logout."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated: !!user || !!session, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
