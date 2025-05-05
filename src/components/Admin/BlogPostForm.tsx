import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost, BlogCategory } from '@/lib/types';
import { saveBlogPost } from '@/lib/services/blogService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import our components
import { FormHeader } from './BlogPost/FormHeader';
import { TitleExcerptSection } from './BlogPost/TitleExcerptSection';
import { ContentSection } from './BlogPost/ContentSection';
import { CategorySection } from './BlogPost/CategorySection';
import { ImageUploadSection } from './BlogPost/ImageUploadSection';
import { FeaturedToggle } from './BlogPost/FeaturedToggle';
import { FormActions } from './BlogPost/FormActions';
import { AuthCheck } from './BlogPost/AuthCheck';

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState<BlogCategory>(post?.category || 'real-estate');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.coverImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);

  // More robust session/auth checking on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Force refresh Supabase session first
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Error refreshing session in BlogPostForm:", refreshError);
        }
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log("Checking auth in BlogPostForm:", { 
          hasSession: !!currentSession, 
          hasUser: !!user,
          sessionUserId: currentSession?.user?.id,
          userId: user?.id,
          sessionExpiration: currentSession ? new Date(currentSession.expires_at! * 1000).toLocaleString() : 'none'
        });
        
        // If we have either a session or a user, consider authenticated
        const isAuth = !!currentSession || !!user;
        setIsAuthenticated(isAuth);
        setAuthCheckCompleted(true);
        
        if (!isAuth) {
          toast({
            title: "Authentication required",
            description: "Please log in to create or edit posts.",
            variant: "destructive"
          });
          navigate('/login', { replace: true });
        } else {
          console.log("BlogPostForm: User authenticated as:", 
            user?.username || currentSession?.user.email || "Unknown user");
        }
      } catch (error) {
        console.error("Error verifying authentication in BlogPostForm:", error);
        setIsAuthenticated(false);
        setAuthCheckCompleted(true);
        toast({
          title: "Authentication error",
          description: "There was an error verifying your authentication status.",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
      }
    };
    
    verifyAuth();
  }, [user, navigate, toast, session]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image file size exceeds 2MB limit",
        variant: "destructive"
      });
      return;
    }

    // For local file preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setFormError("Title is required");
      return false;
    }
    if (!excerpt.trim()) {
      setFormError("Excerpt is required");
      return false;
    }
    if (!content.trim()) {
      setFormError("Content is required");
      return false;
    }
    if (!coverImage) {
      setFormError("Cover image is required");
      return false;
    }
    
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: formError || "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Force refresh authentication status before submitting
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error("Error refreshing session before post submission:", refreshError);
        toast({
          title: "Authentication Error",
          description: "Failed to refresh your session. Please log in again.",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
        return;
      }
      
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      console.log("Submitting with auth status:", { 
        hasSession: !!currentSession, 
        hasUser: !!user,
        sessionUser: currentSession?.user?.email,
        userData: user,
        sessionExpiration: currentSession ? new Date(currentSession.expires_at! * 1000).toLocaleString() : 'none'
      });
      
      if (!currentSession && !user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save blog posts.",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
        return;
      }
      
      console.log("Creating blog post with data:", { title, excerpt, category, featured });
      
      const blogPost: BlogPost = {
        id: post?.id || '',
        title,
        slug: post?.slug || '',
        excerpt,
        content,
        category,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        publishedDate: post?.publishedDate || new Date().toISOString(),
        author: post?.author || user?.username || currentSession?.user.email || 'Admin',
        featured,
      };

      const savedPost = await saveBlogPost(blogPost);
      console.log("Post saved successfully:", savedPost);
      
      toast({
        title: post ? 'Post Updated' : 'Post Created',
        description: `"${title}" has been successfully ${post ? 'updated' : 'published'}.`,
      });
      
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving blog post:', error);
      
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'There was an error saving your post. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // If it's an authentication error, redirect to login
      if (errorMessage.includes('not authenticated')) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth check is in progress
  if (!authCheckCompleted) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Checking authentication...</span>
      </div>
    );
  }

  // If auth check is done but not authenticated, show AuthCheck
  if (!isAuthenticated) {
    return <AuthCheck user={user} onAuthChecked={setIsAuthenticated} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormHeader formError={formError} />
      
      <div className="space-y-4">
        <TitleExcerptSection 
          title={title}
          setTitle={setTitle}
          excerpt={excerpt}
          setExcerpt={setExcerpt}
        />

        <ContentSection 
          content={content}
          setContent={setContent}
        />

        <CategorySection 
          category={category}
          setCategory={setCategory}
        />

        <ImageUploadSection 
          handleImageChange={handleImageChange}
          imagePreview={imagePreview}
        />

        <FeaturedToggle 
          featured={featured}
          setFeatured={setFeatured}
        />
      </div>

      <FormActions 
        isSubmitting={isSubmitting}
        isEditMode={!!post}
      />
    </form>
  );
}
