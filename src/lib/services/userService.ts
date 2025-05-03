
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { mapSupabaseToUser, mapUserToSupabase } from '../supabaseTypes';

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return users.map(mapSupabaseToUser);
  } catch (error) {
    console.error('Error in getUsers function:', error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user by id:', error);
      return undefined;
    }
    
    if (!user) {
      return undefined;
    }
    
    return mapSupabaseToUser(user);
  } catch (error) {
    console.error('Error in getUserById function:', error);
    return undefined;
  }
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
  console.log('Fetching user by username:', username);
  
  // First try to check if this is the default admin user
  if (username.toLowerCase() === 'admin') {
    console.log('Admin user requested, returning hardcoded admin user');
    return {
      id: 'admin-user-id',
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    };
  }
  
  try {
    // If not admin, proceed with database query
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    if (!user) {
      console.log('No user found with username:', username);
      return undefined;
    }
    
    console.log('User found:', user);
    return mapSupabaseToUser(user);
  } catch (error) {
    console.error('Error in getUserByUsername function:', error);
    return undefined;
  }
};

export const saveUser = async (user: User): Promise<User> => {
  try {
    const supabaseUser = mapUserToSupabase(user);
    
    const { data, error } = user.id
      ? await supabase
          .from('users')
          .update(supabaseUser)
          .eq('id', user.id)
          .select()
          .single()
      : await supabase
          .from('users')
          .insert(supabaseUser)
          .select()
          .single();
    
    if (error) {
      console.error('Error saving user:', error);
      throw new Error(`Failed to save user: ${error.message}`);
    }
    
    return mapSupabaseToUser(data);
  } catch (error) {
    console.error('Error in saveUser function:', error);
    throw error;
  }
};
