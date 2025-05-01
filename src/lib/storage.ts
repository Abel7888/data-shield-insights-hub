
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
  // If it's a new post (no ID), generate an ID and slug
  if (!post.id) {
    post.slug = generateSlug(post.title);
    post.publishedDate = new Date().toISOString();
  } else {
    // Find existing post to check if title changed
    const existingPost = await getBlogPostById(post.id);
    if (existingPost && existingPost.title !== post.title) {
      post.slug = generateSlug(post.title);
    }
  }

  const supabasePost = mapBlogPostToSupabase(post);
  
  const { data, error } = post.id
    ? await supabase
        .from('blog_posts')
        .update(supabasePost)
        .eq('id', post.id)
        .select('*')
        .single()
    : await supabase
        .from('blog_posts')
        .insert(supabasePost)
        .select('*')
        .single();
  
  if (error) {
    console.error('Error saving blog post:', error);
    throw new Error(`Failed to save blog post: ${error.message}`);
  }
  
  return mapSupabaseToBlogPost(data);
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
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();
  
  if (error) {
    console.error('Error fetching user by username:', error);
    return undefined;
  }
  
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
  localStorage.setItem('data-shield-auth-token', userId);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('data-shield-auth-token');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('data-shield-auth-token');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAuthToken();
  if (!token) return null;
  
  const user = await getUserById(token);
  return user || null;
};
