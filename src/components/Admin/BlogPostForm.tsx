
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost, BlogCategory, categoryLabels } from '@/lib/types';
import { saveBlogPost } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For local file preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
      
      toast({
        title: post ? 'Post Updated' : 'Post Created',
        description: `"${title}" has been successfully ${post ? 'updated' : 'published'}.`,
      });
      
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving your post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the post"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here (supports Markdown)"
            className="min-h-[300px]"
            required
          />
          <p className="text-xs text-muted-foreground">
            Use Markdown for formatting. Headings: # H1, ## H2; Lists: - item; Bold: **text**; Links: [title](url)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as BlogCategory)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Cover Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Cover image preview"
                className="max-h-40 rounded-md"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Recommended size: 1200×630px. Max file size: 2MB
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={setFeatured}
          />
          <Label htmlFor="featured">Feature this post on the homepage</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {post ? 'Updating...' : 'Publishing...'}
            </>
          ) : post ? 'Update Post' : 'Publish Post'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/posts')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
