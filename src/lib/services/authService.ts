
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

export const isLocallyAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token === 'admin-user-id'; // Simple check for admin token
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check for local admin authentication
    const token = getAuthToken();
    if (token === 'admin-user-id') {
      console.log('Admin user is authenticated locally');
      return {
        id: 'admin-user-id',
        username: 'admin',
        password: 'admin123',
        isAdmin: true
      };
    }
    
    // Fallback: try Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Found active Supabase session');
      return {
        id: session.user.id,
        username: session.user.email || 'user',
        password: '',
        isAdmin: true
      };
    }
    
    // No local or Supabase auth
    if (!token) {
      console.log('No auth token found, user is not authenticated');
      return null;
    }
    
    // Check custom users
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
