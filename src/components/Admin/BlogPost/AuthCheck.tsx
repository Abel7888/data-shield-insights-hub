
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';

interface AuthCheckProps {
  user: User | null;
  onAuthChecked?: (isAuth: boolean) => void;
}

export const AuthCheck = ({ user, onAuthChecked }: AuthCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        
        // First check for existing session (fast path)
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session, we're good
        if (session) {
          console.log("AuthCheck: Session found, user is authenticated");
          console.log("Session user:", session.user.email);
          console.log("Session expiration:", new Date(session.expires_at! * 1000).toLocaleString());
          
          if (onAuthChecked) onAuthChecked(true);
          return true;
        }
        
        // If we don't have a session but have a user, try refreshing
        if (!session && user) {
          console.log("AuthCheck: No session but user exists, trying to refresh");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
            // Continue to next checks as we may have a valid local user
          } else if (refreshData.session) {
            console.log("Session refreshed successfully");
            if (onAuthChecked) onAuthChecked(true);
            return true;
          }
        }
        
        // If no Supabase session and no local user, redirect to login
        if (!session && !user) {
          console.error("Authentication check failed - No session or user found");
          toast({
            title: "Authentication required",
            description: "Please log in to create or edit posts.",
            variant: "destructive"
          });
          if (onAuthChecked) onAuthChecked(false);
          navigate('/login', { replace: true });
          return false;
        } else if (user) {
          // We have a local user - proceed
          console.log("AuthCheck: User is authenticated via local user");
          console.log("User exists:", user.username);
          if (onAuthChecked) onAuthChecked(true);
          return true;
        }
        
        // Final fallback - not authenticated
        console.log("AuthCheck: User is not authenticated");
        if (onAuthChecked) onAuthChecked(false);
        navigate('/login', { replace: true });
        return false;
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication error",
          description: "There was an error verifying your authentication status.",
          variant: "destructive"
        });
        if (onAuthChecked) onAuthChecked(false);
        return false;
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [user, navigate, toast, onAuthChecked]);

  // Return null as this is just a utility component
  return null;
};
