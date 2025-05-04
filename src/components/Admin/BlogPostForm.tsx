
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost, BlogCategory } from '@/lib/types';
import { saveBlogPost } from '@/lib/services/blogService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Import our new components
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
  const { user } = useAuth();
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

  // Check authentication
  <AuthCheck user={user} />

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
        author: post?.author || user?.username || 'Admin',
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
      
      toast({
        title: 'Error',
        description: `${error instanceof Error ? error.message : 'There was an error saving your post. Please try again.'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
