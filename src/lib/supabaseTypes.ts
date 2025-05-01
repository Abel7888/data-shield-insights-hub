
import { Database } from '@/integrations/supabase/types';
import { BlogCategory, BlogPost, User } from './types';

// Type for Supabase blog post row
export type SupabaseBlogPost = Database['public']['Tables']['blog_posts']['Row'];

// Type for Supabase user row
export type SupabaseUser = Database['public']['Tables']['users']['Row'];

// Convert from Supabase blog post to our application BlogPost type
export function mapSupabaseToBlogPost(post: SupabaseBlogPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    category: post.category as BlogCategory,
    publishedDate: post.published_date,
    author: post.author,
    featured: post.featured || false
  };
}

// Convert from our application BlogPost type to Supabase format
export function mapBlogPostToSupabase(post: BlogPost): Omit<SupabaseBlogPost, 'id'> & { id?: string } {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage,
    category: post.category,
    published_date: post.publishedDate,
    author: post.author,
    featured: post.featured
  };
}

// Convert from Supabase user to our application User type
export function mapSupabaseToUser(user: SupabaseUser): User {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    isAdmin: user.is_admin || false
  };
}

// Convert from our application User type to Supabase format
export function mapUserToSupabase(user: User): Omit<SupabaseUser, 'id'> & { id?: string } {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    is_admin: user.isAdmin
  };
}
