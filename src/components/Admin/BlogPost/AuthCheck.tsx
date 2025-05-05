
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { isLocallyAuthenticated } from '@/lib/services/authService';

interface AuthCheckProps {
  user: User | null;
  onAuthChecked?: (isAuth: boolean) => void;
}

export const AuthCheck = ({ user, onAuthChecked }: AuthCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simple check: either Supabase session or local admin auth
        if (isAuthenticated || isLocallyAuthenticated()) {
          console.log("AuthCheck: User is authenticated");
          if (onAuthChecked) onAuthChecked(true);
          return;
        }
        
        // Not authenticated
        console.log("AuthCheck: User is not authenticated");
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
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication error",
          description: "There was an error verifying your authentication status.",
          variant: "destructive"
        });
        if (onAuthChecked) onAuthChecked(false);
      }
    };
    
    checkAuth();
  }, [user, navigate, toast, onAuthChecked, isAuthenticated]);

  // Return null as this is just a utility component
  return null;
};
