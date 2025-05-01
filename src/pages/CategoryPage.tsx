
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostsByCategory } from '@/lib/storage';
import { BlogPost, categoryLabels, BlogCategory } from '@/lib/types';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BlogCard } from '@/components/BlogPost/BlogCard';
import { Shield, Loader2 } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (categoryId) {
        setIsLoading(true);
        
        if (Object.keys(categoryLabels).includes(categoryId)) {
          try {
            const categoryPosts = await getBlogPostsByCategory(categoryId as BlogCategory);
            setPosts(categoryPosts);
            setIsValidCategory(true);
            document.title = `${categoryLabels[categoryId as BlogCategory]} | Data Shield Blogs`;
          } catch (error) {
            console.error('Error fetching posts by category:', error);
          }
        } else {
          setIsValidCategory(false);
        }
        
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [categoryId]);
  
  // Helper function to get category descriptions
  const getCategoryDescription = (category: string) => {
    switch(category) {
      case 'real-estate': 
        return 'Exploring blockchain, AI, and IoT innovations in property markets';
      case 'finance': 
        return 'Decoding blockchain, AI, and algorithmic trends in financial services';
      case 'healthcare': 
        return 'Analyzing telemedicine, AI diagnostics, and digital health solutions';
      case 'supply-chain': 
        return 'Tracking blockchain, IoT, and AI automation in logistics networks';
      case 'cybersecurity': 
        return 'Examining threat intelligence, zero-trust architecture, and security frameworks';
      default: 
        return 'The latest insights on emerging technologies';
    }
  };
  
  // Get background color class based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'real-estate': return 'from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50';
      case 'finance': return 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50';
      case 'healthcare': return 'from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50';
      case 'supply-chain': return 'from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50';
      case 'cybersecurity': return 'from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50';
      default: return 'from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-shield" />
        </div>
      </MainLayout>
    );
  }

  if (!isValidCategory) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`bg-gradient-to-r ${categoryId ? getCategoryColor(categoryId) : ''} py-12`}>
        <div className="container max-w-6xl">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="h-6 w-6 text-shield mr-2" />
              <span className="text-sm font-medium">{categoryId && categoryLabels[categoryId as BlogCategory]}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-shield-dark to-shield bg-clip-text text-transparent">
            {categoryId && categoryLabels[categoryId as BlogCategory]}
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {categoryId && getCategoryDescription(categoryId)}
          </p>
        </div>
      </div>
      
      <div className="container py-12 max-w-6xl">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">
              No articles found in this category.
            </p>
            <Link to="/" className="text-primary hover:underline">
              Return to homepage
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
