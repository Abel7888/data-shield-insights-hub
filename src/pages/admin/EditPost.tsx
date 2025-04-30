
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { getBlogPostById } from '@/lib/storage';
import { BlogPost } from '@/lib/types';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdBanner } from '@/components/Advertisement/AdBanner';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getBlogPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return <Navigate to="/admin/posts" replace />;
  }

  return (
    <AdminLayout>
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-shield" />
        <h2 className="text-xl font-bold">Edit Post</h2>
      </div>
      
      <Tabs defaultValue="post">
        <TabsList className="mb-4">
          <TabsTrigger value="post">Post Content</TabsTrigger>
          <TabsTrigger value="ads">Advertisement Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post">
          <div className="bg-white dark:bg-black/20 rounded-lg shadow-sm p-6">
            {post && <BlogPostForm post={post} />}
          </div>
        </TabsContent>
        
        <TabsContent value="ads">
          <div className="bg-white dark:bg-black/20 rounded-lg shadow-sm p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Preview how advertisements will appear in your posts. Advertisements are automatically inserted in the middle of your content.
            </p>
            <AdBanner variant="inline" />
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default EditPost;
