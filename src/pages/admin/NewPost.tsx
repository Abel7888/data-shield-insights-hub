
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdBanner } from '@/components/Advertisement/AdBanner';

const NewPost = () => {
  return (
    <AdminLayout>
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-shield" />
        <h2 className="text-xl font-bold">Create New Post</h2>
      </div>
      
      <Tabs defaultValue="post">
        <TabsList className="mb-4">
          <TabsTrigger value="post">Post Content</TabsTrigger>
          <TabsTrigger value="ads">Advertisement Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="post">
          <div className="bg-white dark:bg-black/20 rounded-lg shadow-sm p-6">
            <BlogPostForm />
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

export default NewPost;
