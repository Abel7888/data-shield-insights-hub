
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostsByCategory } from '@/lib/storage';
import { BlogPost, categoryLabels, BlogCategory } from '@/lib/types';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BlogCard } from '@/components/BlogPost/BlogCard';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidCategory, setIsValidCategory] = useState(true);

  useEffect(() => {
    if (categoryId) {
      setIsLoading(true);
      
      if (Object.keys(categoryLabels).includes(categoryId)) {
        const categoryPosts = getBlogPostsByCategory(categoryId as BlogCategory);
        setPosts(categoryPosts);
        setIsValidCategory(true);
        document.title = `${categoryLabels[categoryId as BlogCategory]} | Data Shield Blogs`;
      } else {
        setIsValidCategory(false);
      }
      
      setIsLoading(false);
    }
  }, [categoryId]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
      <div className="bg-accent py-8">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            {categoryId && categoryLabels[categoryId as BlogCategory]}
          </h1>
          <p className="text-center text-muted-foreground">
            The latest insights on emerging technologies in {categoryId && categoryLabels[categoryId as BlogCategory].toLowerCase()}
          </p>
        </div>
      </div>
      
      <div className="container py-8">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
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
