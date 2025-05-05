
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdBanner } from '@/components/Advertisement/AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewPost = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Force refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Error refreshing session in NewPost:", refreshError);
        }
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log("NewPost auth verification:", {
          hasSession: !!currentSession,
          hasUser: !!user,
          sessionExpiration: currentSession ? new Date(currentSession.expires_at! * 1000).toLocaleString() : 'none'
        });
        
        if (!currentSession && !user) {
          console.log("No authenticated user found, redirecting to login");
          toast({
            title: "Authentication Required",
            description: "Please log in to create new posts.",
            variant: "destructive"
          });
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error("Error verifying auth in NewPost:", error);
      } finally {
        setIsVerifyingAuth(false);
      }
    };
    
    verifyAuth();
  }, [user, session, navigate, toast]);

  if (isVerifyingAuth) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Verifying authentication...</span>
        </div>
      </AdminLayout>
    );
  }

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
