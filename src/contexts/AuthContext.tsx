
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getUserByUsername } from '@/lib/services/userService';
import { setAuthToken, removeAuthToken, getCurrentUser } from '@/lib/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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
        
        // Set up auth state listener FIRST (to prevent missing auth events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('Auth state changed:', event);
          setSession(currentSession);
          
          if (currentSession) {
            console.log('Session user data:', currentSession.user);
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
        
        // THEN check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        
        if (existingSession) {
          console.log('Found Supabase session, using session user');
          setUser({
            id: existingSession.user.id,
            username: existingSession.user.email || 'user',
            password: '', // We don't store passwords in the frontend
            isAdmin: true // Assuming logged in users are admins for now
          });
        } else {
          // Fall back to our custom auth
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

  const logout = () => {
    // Sign out from Supabase first
    supabase.auth.signOut().then(() => {
      setUser(null);
      setSession(null);
      removeAuthToken();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    }).catch(error => {
      console.error('Error during logout:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user || !!session, isLoading, login, logout }}>
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
