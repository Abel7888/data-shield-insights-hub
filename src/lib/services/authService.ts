
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { getUserById, getUserByUsername } from './userService';

// Authentication
export const setAuthToken = (userId: string): void => {
  console.log('Setting auth token for user:', userId);
  localStorage.setItem('data-shield-auth-token', userId);
};

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('data-shield-auth-token');
  console.log('Retrieved auth token:', token);
  return token;
};

export const removeAuthToken = (): void => {
  console.log('Removing auth token');
  localStorage.removeItem('data-shield-auth-token');
};

export const refreshSession = async (): Promise<boolean> => {
  try {
    console.log('Attempting to refresh Supabase session');
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error.message);
      return false;
    }

    if (data && data.session) {
      console.log('Session refreshed successfully', {
        user: data.session.user.email,
        expires: new Date(data.session.expires_at! * 1000).toLocaleString()
      });
      return true;
    } else {
      console.log('No session returned after refresh attempt');
      return false;
    }
  } catch (error) {
    console.error('Exception during session refresh:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First attempt to get the current session directly
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Found active Supabase session, returning user from session');
      console.log('Session user ID:', session.user.id);
      console.log('Session user email:', session.user.email);
      
      return {
        id: session.user.id,
        username: session.user.email || 'user',
        password: '', // We don't store passwords in the frontend
        isAdmin: true // Assuming logged in users through Supabase are admins for now
      };
    }

    // If no session found, try refreshing session as a fallback
    const refreshSuccess = await refreshSession();
    
    if (refreshSuccess) {
      // Get the refreshed session
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      
      if (refreshedSession) {
        console.log('Using refreshed session');
        return {
          id: refreshedSession.user.id,
          username: refreshedSession.user.email || 'user',
          password: '',
          isAdmin: true
        };
      }
    }
  
    // If no Supabase session, check if admin user is logged in
    const token = getAuthToken();
    if (token === 'admin-user-id') {
      console.log('Admin user is authenticated');
      return {
        id: 'admin-user-id',
        username: 'admin',
        password: 'admin123',
        isAdmin: true
      };
    }
    
    // If not admin, fail early
    if (!token) {
      console.log('No auth token found, user is not authenticated');
      return null;
    }
    
    console.log('Fetching current user with token:', token);
    const user = await getUserById(token);
    if (!user) {
      console.log('No user found for token, removing invalid token');
      removeAuthToken();
      return null;
    }
    
    console.log('Current user:', user);
    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
