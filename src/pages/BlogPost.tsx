
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/storage';
import { BlogPost as BlogPostType, categoryLabels } from '@/lib/types';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BlogCard } from '@/components/BlogPost/BlogCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      const foundPost = getBlogPostBySlug(slug);
      
      if (foundPost) {
        setPost(foundPost);
        document.title = `${foundPost.title} | Data Shield Blogs`;
        
        // Get related posts from the same category (excluding current post)
        const recent = getRecentBlogPosts(10)
          .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(recent);
      } else {
        setNotFound(true);
      }
      
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (notFound || !post) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </MainLayout>
    );
  }

  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MainLayout>
      {/* Hero section */}
      <div className="bg-accent">
        <div className="container py-12">
          <Link 
            to={`/category/${post.category}`}
            className="text-sm text-muted-foreground hover:text-shield transition-colors"
          >
            ← Back to {categoryLabels[post.category]}
          </Link>
          
          <div className="max-w-3xl mx-auto mt-6">
            <Badge variant="secondary" className="mb-4">
              {categoryLabels[post.category]}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span className="mx-2">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <article className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full object-cover h-[300px] md:h-[400px]"
            />
          </div>
          
          <div className="blog-content prose prose-lg prose-headings:text-foreground prose-a:text-shield">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          
          <div className="mt-12">
            <Separator className="mb-8" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Related Articles</h2>
              <Link 
                to={`/category/${post.category}`}
                className="text-sm text-primary hover:underline"
              >
                More in {categoryLabels[post.category]} →
              </Link>
            </div>
            
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">
                No related articles found.
              </p>
            )}
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

export default BlogPost;
