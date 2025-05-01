
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { BlogCard } from '@/components/BlogPost/BlogCard';
import { getRecentBlogPosts } from '@/lib/storage';
import { BlogPost, categoryLabels, BlogCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Loader2 } from 'lucide-react';
import { AdBanner } from '@/components/Advertisement/AdBanner';

const Index = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategory>('all');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Get more posts since we don't have featured posts now
        const posts = await getRecentBlogPosts(24);
        setRecentPosts(posts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
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
      <div className="bg-accent py-12">
        <div className="container max-w-6xl">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="h-6 w-6 text-shield mr-2" />
              <span className="text-sm font-medium">Secure Insights</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-shield-dark to-shield bg-clip-text text-transparent">Data Shield Blogs</h1>
          <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
            Expert insights on emerging technologies across real estate, finance, healthcare, supply chain, and cybersecurity
          </p>
        </div>
      </div>
      
      <div className="container py-8 max-w-6xl">
        {/* Advertisement Banner - Top of homepage */}
        <div className="mb-8">
          <AdBanner variant="inline" />
        </div>
        
        <section className="mb-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-accent/50 p-1">
                <TabsTrigger value="all" onClick={() => setSelectedCategory('all')} className="text-sm">
                  All
                </TabsTrigger>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <TabsTrigger 
                    key={key}
                    value={key}
                    onClick={() => setSelectedCategory(key as BlogCategory)}
                    className="text-sm"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 mx-auto animate-spin text-shield" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.length > 0 && filteredPosts.slice(0, 3).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {/* Middle Advertisement Banner */}
                  {filteredPosts.length > 3 && (
                    <div className="my-8">
                      <AdBanner variant="inline" />
                    </div>
                  )}
                  
                  {/* Remaining Posts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredPosts.length > 3 && filteredPosts.slice(3).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground">No articles found.</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            {Object.keys(categoryLabels).map((key) => (
              <TabsContent key={key} value={key} className="m-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 mx-auto animate-spin text-shield" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.slice(0, 3).map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                    
                    {/* Middle Advertisement Banner */}
                    {filteredPosts.length > 3 && (
                      <div className="my-8">
                        <AdBanner variant="inline" />
                      </div>
                    )}
                    
                    {/* Remaining Posts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {filteredPosts.slice(3).map((post) => (
                        <BlogCard key={post.id} post={post} />
                      ))}
                    </div>
                    
                    {filteredPosts.length === 0 && (
                      <div className="text-center py-12 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">No articles found in this category.</p>
                      </div>
                    )}
                  </>
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
