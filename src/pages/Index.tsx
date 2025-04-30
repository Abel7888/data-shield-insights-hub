
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BlogCard } from '@/components/BlogPost/BlogCard';
import { FeaturedPost } from '@/components/BlogPost/FeaturedPost';
import { getFeaturedBlogPosts, getRecentBlogPosts } from '@/lib/storage';
import { BlogPost, categoryLabels, BlogCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategory>('all');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setFeaturedPosts(getFeaturedBlogPosts());
    setRecentPosts(getRecentBlogPosts(12));
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(recentPosts);
    } else {
      setFilteredPosts(recentPosts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory, recentPosts]);

  return (
    <MainLayout>
      <div className="bg-accent py-8">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Data Shield Blogs</h1>
          <p className="text-center text-muted-foreground mb-6">
            Insights on emerging technologies across real estate, finance, healthcare, and supply chain
          </p>
        </div>
      </div>
      
      <div className="container py-8">
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <FeaturedPost post={featuredPosts[0]} />
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
                All
              </TabsTrigger>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger 
                  key={key}
                  value={key}
                  onClick={() => setSelectedCategory(key as BlogCategory)}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found.</p>
                </div>
              )}
            </TabsContent>
            
            {Object.keys(categoryLabels).map((key) => (
              <TabsContent key={key} value={key} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
                
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No articles found in this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
