
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getUserByUsername } from '@/lib/services/userService';
import { setAuthToken, removeAuthToken, getCurrentUser, refreshSession } from '@/lib/services/authService';
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
  refreshUserSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to refresh session that can be exported to components
  const refreshUserSession = async (): Promise<boolean> => {
    try {
      const success = await refreshSession();
      if (success) {
        // Get the new session after refresh
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession) {
          setSession(newSession);
          setUser({
            id: newSession.user.id,
            username: newSession.user.email || 'user',
            password: '',
            isAdmin: true
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error refreshing user session:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        console.log("Initializing authentication...");
        
        // 1. Set up auth state listener FIRST (to prevent missing auth events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('Auth state changed:', event);
          
          if (currentSession) {
            console.log('Session user data:', currentSession.user);
            setSession(currentSession);
            setUser({
              id: currentSession.user.id,
              username: currentSession.user.email || 'user',
              password: '',
              isAdmin: true
            });
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setUser(null);
            setSession(null);
          }
        });
        
        // 2. Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Found existing session:', {
            user: currentSession.user.email,
            expires: new Date(currentSession.expires_at! * 1000).toLocaleString() 
          });
          setSession(currentSession);
          setUser({
            id: currentSession.user.id,
            username: currentSession.user.email || 'user',
            password: '',
            isAdmin: true
          });
        } else {
          // 3. No session, try refreshing
          await refreshUserSession();
        }
        
        // 4. If still no session, fall back to custom auth
        if (!session) {
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
    
    // Return cleanup function to unsubscribe
    return () => {
      supabase.auth.onAuthStateChange(() => {}).data.subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting to login with username:', username);
      
      // Try Supabase login first if it's an email
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
          console.log('Supabase login failed, falling back to custom auth:', error.message);
        }
      }
      
      // Fall back to custom auth
      const foundUser = await getUserByUsername(username);
      
      if (foundUser && foundUser.password === password) {
        console.log('Login successful for user:', foundUser);
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
      logout, 
      refreshUserSession 
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
