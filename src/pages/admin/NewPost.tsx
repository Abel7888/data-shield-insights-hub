
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdBanner } from '@/components/Advertisement/AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const NewPost = () => {
  const { user, session, refreshUserSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [authStatus, setAuthStatus] = useState('Verifying...');

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsVerifyingAuth(true);
        setAuthStatus('Checking authentication...');
        
        // Skip extra checks if we already know user is authenticated
        if (isAuthenticated) {
          console.log("NewPost: User is already authenticated");
          const userInfo = user?.username || (session?.user?.email || "Unknown");
          setAuthStatus(`Authenticated as ${userInfo}`);
          setIsVerifyingAuth(false);
          return;
        }
        
        // Try refreshing the session
        const refreshSuccess = await refreshUserSession();
        
        if (refreshSuccess) {
          console.log("Session refreshed successfully in NewPost");
          setAuthStatus(`Authentication refreshed successfully`);
          setIsVerifyingAuth(false);
          return;
        }
        
        // If we have a local user but no Supabase session, we can still proceed
        if (user && !session) {
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
  }, [user, session, navigate, toast, refreshUserSession, isAuthenticated]);

  const handleForceRefresh = async () => {
    setIsVerifyingAuth(true);
    setAuthStatus('Manually refreshing authentication...');
    
    const success = await refreshUserSession();
    
    if (success) {
      setAuthStatus('Authentication refreshed successfully');
      toast({
        title: "Session Refreshed",
        description: "Your authentication session has been refreshed."
      });
    } else {
      setAuthStatus('Failed to refresh authentication');
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh your session. Please try logging in again.",
        variant: "destructive"
      });
    }
    
    setIsVerifyingAuth(false);
  };

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-shield" />
          <h2 className="text-xl font-bold">Create New Post</h2>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleForceRefresh}>
          Refresh Session
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
