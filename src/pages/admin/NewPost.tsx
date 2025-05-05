
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdBanner } from '@/components/Advertisement/AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { isLocallyAuthenticated } from '@/lib/services/authService';

const NewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authStatus, setAuthStatus] = useState(
    isLocallyAuthenticated() 
      ? 'Authenticated as admin (local)' 
      : user ? `Authenticated as ${user.username}` : 'Not authenticated'
  );

  // No loading or verification - leave that to the AuthCheck component in BlogPostForm

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-shield" />
          <h2 className="text-xl font-bold">Create New Post</h2>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/login')}
        >
          Login/Refresh Auth
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-muted rounded-md text-sm">
        <div className="font-medium">Authentication Status</div>
        <div className="text-muted-foreground">{authStatus}</div>
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
