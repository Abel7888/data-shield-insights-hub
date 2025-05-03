
import { User } from '../types';
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
  const token = getAuthToken();
  if (!token) {
    console.log('No auth token found, user is not authenticated');
    return null;
  }
  
  // Check if it's the admin user
  if (token === 'admin-user-id') {
    console.log('Admin user is authenticated');
    return {
      id: 'admin-user-id',
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    };
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
};
