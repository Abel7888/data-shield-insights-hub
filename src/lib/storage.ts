import { supabase } from '@/integrations/supabase/client';
import { BlogPost, User, BlogCategory } from './types';
import { mapBlogPostToSupabase, mapSupabaseToBlogPost, mapSupabaseToUser, mapUserToSupabase } from './supabaseTypes';

// Helper to generate random IDs
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Helper to generate slugs from titles
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Blog Post Storage
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return posts.map(mapSupabaseToBlogPost);
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error('Error fetching blog post by slug:', error);
    return undefined;
  }
  
  return mapSupabaseToBlogPost(post);
};

export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching blog post by id:', error);
    return undefined;
  }
  
  return mapSupabaseToBlogPost(post);
};

export const getBlogPostsByCategory = async (category: BlogCategory): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category);
  
  if (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
  
  return posts.map(mapSupabaseToBlogPost);
};

export const getRecentBlogPosts = async (count: number = 5): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(count);
  
  if (error) {
    console.error('Error fetching recent blog posts:', error);
    return [];
  }
  
  return posts.map(mapSupabaseToBlogPost);
};

export const getFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true);
  
  if (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
  
  return posts.map(mapSupabaseToBlogPost);
};

export const saveBlogPost = async (post: BlogPost): Promise<BlogPost> => {
  console.log('Saving blog post:', post);
  
  try {
    // Prepare post data
    const isNewPost = !post.id || post.id === '';
    
    if (isNewPost) {
      console.log('Creating new post');
      post.id = generateId();
      post.slug = generateSlug(post.title);
      post.publishedDate = new Date().toISOString();
    } else {
      console.log('Updating existing post:', post.id);
      // Find existing post to check if title changed
      const existingPost = await getBlogPostById(post.id);
      if (existingPost && existingPost.title !== post.title) {
        post.slug = generateSlug(post.title);
      }
    }

    // Explicitly create the data object to match Supabase schema
    const postData = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.coverImage,
      category: post.category,
      published_date: post.publishedDate,
      author: post.author,
      featured: post.featured || false
    };
    
    console.log('Sending to Supabase:', postData);
    
    let result;
    
    if (isNewPost) {
      // Insert new post using upsert to avoid conflicts
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(postData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw new Error(`Failed to save blog post: ${error.message}`);
      }
      
      result = data;
      console.log('Post created successfully:', data);
    } else {
      // Update existing post
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', post.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to save blog post: ${error.message}`);
      }
      
      result = data;
      console.log('Post updated successfully:', data);
    }
    
    return mapSupabaseToBlogPost(result);
  } catch (error) {
    console.error('Error in saveBlogPost function:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
  
  return true;
};

// User Storage
export const getUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return users.map(mapSupabaseToUser);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching user by id:', error);
    return undefined;
  }
  
  return mapSupabaseToUser(user);
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
};

export const saveUser = async (user: User): Promise<User> => {
  const supabaseUser = mapUserToSupabase(user);
  
  const { data, error } = user.id
    ? await supabase
        .from('users')
        .update(supabaseUser)
        .eq('id', user.id)
        .select('*')
        .single()
    : await supabase
        .from('users')
        .insert(supabaseUser)
        .select('*')
        .single();
  
  if (error) {
    console.error('Error saving user:', error);
    throw new Error(`Failed to save user: ${error.message}`);
  }
  
  return mapSupabaseToUser(data);
};

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
