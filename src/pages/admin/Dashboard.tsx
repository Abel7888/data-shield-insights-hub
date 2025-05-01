
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/storage';
import { BlogCategory, BlogPost, categoryLabels } from '@/lib/types';

const Dashboard = () => {
  const [postStats, setPostStats] = useState({
    total: 0,
    byCategory: {} as Record<BlogCategory, number>,
    featured: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getBlogPosts();
        const byCategory = {} as Record<BlogCategory, number>;
        
        // Initialize all categories with zero
        Object.keys(categoryLabels).forEach(key => {
          byCategory[key as BlogCategory] = 0;
        });
        
        // Count posts by category
        posts.forEach(post => {
          byCategory[post.category]++;
        });
        
        setPostStats({
          total: posts.length,
          byCategory,
          featured: posts.filter(post => post.featured).length
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{postStats.total}</div>
            )}
            <p className="text-xs text-muted-foreground">
              All published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <div className="text-2xl font-bold">{postStats.featured}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Articles featured on homepage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryLabels).length}</div>
            <p className="text-xs text-muted-foreground">
              Main content categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Number of posts in each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Object.keys(categoryLabels).map((category) => (
                  <div key={category} className="flex items-center">
                    <div className="w-40">{categoryLabels[category as BlogCategory]}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full"></div>
                    </div>
                    <div className="w-10 text-right">0</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(postStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-40">{categoryLabels[category as BlogCategory]}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ 
                            width: `${postStats.total > 0 ? (count / postStats.total) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-10 text-right">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/admin/new-post">Create New Post</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/posts">Manage Existing Posts</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link to="/" target="_blank">View Public Site</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
