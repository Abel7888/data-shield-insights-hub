
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface AuthCheckProps {
  user: User | null;
  onAuthChecked?: (isAuth: boolean) => void;
}

export const AuthCheck = ({ user, onAuthChecked }: AuthCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const { refreshUserSession } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        
        // First check for existing session (fast path)
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session, we're good
        if (session) {
          const expiresAt = new Date(session.expires_at! * 1000);
          const now = new Date();
          const timeLeft = Math.round((expiresAt.getTime() - now.getTime()) / 1000 / 60);
          
          console.log("AuthCheck: Session found, user is authenticated", {
            user: session.user.email,
            expiresIn: `${timeLeft} minutes`
          });
          
          if (onAuthChecked) onAuthChecked(true);
          return true;
        }
        
        // If we don't have a session but have a user, try refreshing
        if (!session && user) {
          console.log("AuthCheck: No session but user exists, trying to refresh");
          
          const refreshSuccessful = await refreshUserSession();
          
          if (refreshSuccessful) {
            console.log("Session refreshed successfully in AuthCheck");
            if (onAuthChecked) onAuthChecked(true);
            return true;
          } else {
            console.log("Failed to refresh session in AuthCheck, but we have a local user");
            // We still have a local user, so consider them authenticated
            if (onAuthChecked) onAuthChecked(true);
            return true;
          }
        }
        
        // If no Supabase session and no local user, redirect to login
        if (!session && !user) {
          console.error("Authentication check failed - No session or user found");
          toast({
            title: "Authentication required",
            description: "Please log in to access this area.",
            variant: "destructive"
          });
          if (onAuthChecked) onAuthChecked(false);
          
          // Use setTimeout to avoid state updates during render
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 0);
          
          return false;
        }
        
        // Final fallback - not authenticated
        console.log("AuthCheck: User is not authenticated");
        if (onAuthChecked) onAuthChecked(false);
        
        // Use setTimeout to avoid state updates during render
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 0);
        
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
  }, [user, navigate, toast, onAuthChecked, refreshUserSession]);

  // Return null as this is just a utility component
  return null;
};
