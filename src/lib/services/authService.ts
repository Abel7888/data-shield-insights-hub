
import { User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { getUserById, getUserByUsername } from './userService';
import { useToast } from '@/hooks/use-toast';

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

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check for a Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('Found Supabase session, returning user from session');
      return {
        id: session.user.id,
        username: session.user.email || 'user',
        password: '', // We don't store passwords in the frontend
        isAdmin: true // Assuming logged in users through Supabase are admins for now
      };
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
