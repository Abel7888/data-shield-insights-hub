
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
  const [authStatus, setAuthStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setAuthStatus('Checking session...');
        // First try to get current session (fastest path)
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          const expiresAt = new Date(currentSession.expires_at! * 1000);
          const now = new Date();
          const timeLeft = Math.round((expiresAt.getTime() - now.getTime()) / 1000 / 60);
          
          console.log("NewPost: Active session found", {
            user: currentSession.user.email,
            expiresIn: `${timeLeft} minutes`
          });
          
          setAuthStatus(`Authenticated as ${currentSession.user.email}`);
          setIsVerifyingAuth(false);
          return;
        }
        
        // If no session but we have a user, try refreshing
        if (!currentSession && user) {
          setAuthStatus('No session, trying to refresh...');
          // Force refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing session in NewPost:", refreshError);
            setAuthStatus(`Refresh error: ${refreshError.message}`);
          } else if (refreshData.session) {
            console.log("Session refreshed successfully in NewPost");
            setAuthStatus(`Session refreshed for ${refreshData.session.user.email}`);
            setIsVerifyingAuth(false);
            return;
          }
        }
        
        // If we have a local user but no Supabase session, we can still proceed
        if (user) {
          console.log("NewPost: No Supabase session, but local user found:", user.username);
          setAuthStatus(`Authenticated as ${user.username} (local)`);
          setIsVerifyingAuth(false);
          return;
        }
        
        // No auth at all - redirect to login
        console.log("No authenticated user found, redirecting to login");
        setAuthStatus('Not authenticated');
        toast({
          title: "Authentication Required",
          description: "Please log in to create new posts.",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
      } catch (error) {
        console.error("Error verifying auth in NewPost:", error);
        setAuthStatus('Error checking authentication');
        toast({
          title: "Authentication Error",
          description: "There was a problem verifying your login status.",
          variant: "destructive"
        });
        navigate('/login', { replace: true });
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
          <span className="ml-3">{authStatus}</span>
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
