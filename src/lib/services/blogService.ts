
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '../types';
import { mapBlogPostToSupabase, mapSupabaseToBlogPost } from '../supabaseTypes';

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

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching all blog posts...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*');
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${posts.length} blog posts`);
    return posts.map(mapSupabaseToBlogPost);
  } catch (error) {
    console.error('Error in getBlogPosts function:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    console.log(`Fetching blog post with slug: ${slug}`);
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching blog post by slug:', error);
      return undefined;
    }
    
    console.log('Successfully fetched blog post by slug:', post.title);
    return mapSupabaseToBlogPost(post);
  } catch (error) {
    console.error('Error in getBlogPostBySlug function:', error);
    return undefined;
  }
};

export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  try {
    console.log(`Fetching blog post with ID: ${id}`);
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching blog post by id:', error);
      return undefined;
    }
    
    if (!post) {
      console.log(`No blog post found with ID: ${id}`);
      return undefined;
    }
    
    console.log('Successfully fetched blog post by ID:', post.title);
    return mapSupabaseToBlogPost(post);
  } catch (error) {
    console.error('Error in getBlogPostById function:', error);
    return undefined;
  }
};

export const getBlogPostsByCategory = async (category: BlogCategory): Promise<BlogPost[]> => {
  try {
    console.log(`Fetching blog posts in category: ${category}`);
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error('Error fetching blog posts by category:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${posts.length} blog posts in category: ${category}`);
    return posts.map(mapSupabaseToBlogPost);
  } catch (error) {
    console.error('Error in getBlogPostsByCategory function:', error);
    return [];
  }
};

export const getRecentBlogPosts = async (count: number = 5): Promise<BlogPost[]> => {
  try {
    console.log(`Fetching ${count} recent blog posts`);
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(count);
    
    if (error) {
      console.error('Error fetching recent blog posts:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${posts.length} recent blog posts`);
    return posts.map(mapSupabaseToBlogPost);
  } catch (error) {
    console.error('Error in getRecentBlogPosts function:', error);
    return [];
  }
};

export const getFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching featured blog posts');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true);
    
    if (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }
    
    console.log(`Successfully fetched ${posts.length} featured blog posts`);
    return posts.map(mapSupabaseToBlogPost);
  } catch (error) {
    console.error('Error in getFeaturedBlogPosts function:', error);
    return [];
  }
};

export const saveBlogPost = async (post: BlogPost): Promise<BlogPost> => {
  console.log('Saving blog post:', post.title);
  
  try {
    // First check if we have a valid session directly
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found, trying to refresh session');
      // If no session, try to refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Error refreshing session before saving post:', refreshError);
        throw new Error(`Failed to authenticate: ${refreshError.message}. Please login again.`);
      }
      
      if (!refreshData.session) {
        console.error('No active session found after refresh, user not authenticated');
        throw new Error('User not authenticated. Please login before saving posts.');
      }
      
      console.log('Session successfully refreshed, proceeding with save operation');
    } else {
      console.log('Active session found, proceeding with save operation');
    }
    
    // Prepare post data
    const isNewPost = !post.id || post.id === '';
    
    if (isNewPost) {
      console.log('Creating new post');
      post.id = generateId();
      post.slug = generateSlug(post.title);
      post.publishedDate = new Date().toISOString();
    } else {
      console.log('Updating existing post:', post.id);
      // Check if title changed and update slug if needed
      const existingPost = await getBlogPostById(post.id);
      if (existingPost && existingPost.title !== post.title) {
        post.slug = generateSlug(post.title);
      }
    }

    // Map data to match Supabase schema
    const postData = mapBlogPostToSupabase(post);
    
    console.log('Sending to Supabase:', postData);
    
    let result;
    
    if (isNewPost) {
      // For new posts, use insert
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw new Error(`Failed to save blog post: ${error.message}`);
      }
      
      result = data;
      console.log('Post created successfully:', data.title);
    } else {
      // Update existing post
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', post.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw new Error(`Failed to save blog post: ${error.message}`);
      }
      
      result = data;
      console.log('Post updated successfully:', data.title);
    }
    
    return mapSupabaseToBlogPost(result);
  } catch (error) {
    console.error('Error in saveBlogPost function:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  console.log('Deleting blog post with ID:', id);
  
  try {
    // Check if we have a valid session directly
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found, trying to refresh session');
      // If no session, try to refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Error refreshing session before deleting post:', refreshError);
        throw new Error(`Failed to authenticate: ${refreshError.message}. Please login again.`);
      }
      
      if (!refreshData.session) {
        console.error('No active session found after refresh, user not authenticated');
        throw new Error('User not authenticated. Please login before deleting posts.');
      }
      
      console.log('Session successfully refreshed, proceeding with delete operation');
    } else {
      console.log('Active session found, proceeding with delete operation');
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      throw new Error(`Failed to delete blog post: ${error.message}`);
    }
    
    console.log('Blog post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost function:', error);
    throw error;
  }
};
