
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/lib/types';

interface AuthCheckProps {
  user: User | null;
}

export const AuthCheck = ({ user }: AuthCheckProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsChecking(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no Supabase session, redirect to login
        if (!session && !user) {
          console.log("No authentication found, redirecting to login");
          toast({
            title: "Authentication required",
            description: "Please log in to create or edit posts.",
            variant: "destructive"
          });
          navigate('/login');
        } else {
          console.log("User is authenticated:", user?.username || session?.user.email);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast({
          title: "Authentication error",
          description: "There was an error verifying your authentication status.",
          variant: "destructive"
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAuth();
  }, [user, navigate, toast]);

  // Return a loading state or null based on the checking state
  return null;
};
