
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const { login, isAuthenticated, isLoading, refreshUserSession } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionStatus, setSessionStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pre-fill admin credentials for convenience and check session
  useEffect(() => {
    setUsername('admin');
    setPassword('admin123');
    
    // Check session and debug authentication
    const checkAndDebugSession = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const expiresAt = new Date(session.expires_at! * 1000);
          const now = new Date();
          
          // Check if token is expired
          if (expiresAt < now) {
            setSessionStatus("Session token expired, will try to refresh");
            
            // Try to refresh the session
            const success = await refreshUserSession();
            
            if (success) {
              console.log("Successfully refreshed session on Login page");
              setSessionStatus("Session refreshed successfully");
              
              // Get the new session
              const { data: { session: newSession } } = await supabase.auth.getSession();
              
              if (newSession) {
                const newExpiresAt = new Date(newSession.expires_at! * 1000);
                const timeLeft = Math.round((newExpiresAt.getTime() - now.getTime()) / 1000 / 60);
                setSessionStatus(`Session refreshed, expires in ${timeLeft} minutes`);
              }
            } else {
              setSessionStatus("Failed to refresh session");
            }
          } else {
            const timeLeft = Math.round((expiresAt.getTime() - now.getTime()) / 1000 / 60);
            setSessionStatus(`Active session, expires in ${timeLeft} minutes`);
          }
        } else {
          setSessionStatus("No active session");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionStatus("Error checking session");
      }
    };
    
    checkAndDebugSession();
  }, [refreshUserSession]);
  
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Try to refresh the session
      const success = await refreshUserSession();
      
      if (success) {
        setSessionStatus("Session manually refreshed successfully");
      } else {
        setSessionStatus("Manual refresh failed - no valid session");
      }
    } catch (error) {
      console.error("Error during manual refresh:", error);
      setSessionStatus(`Error during refresh: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      console.log('Submitting login form with username:', username);
      
      // Always clear any existing session first to avoid conflicts
      await supabase.auth.signOut();
      setSessionStatus('Previous session cleared');
      
      const success = await login(username, password);
      
      if (success) {
        console.log('Login successful, redirecting to dashboard');
        setSessionStatus('Login successful - redirecting...');
        
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 500);
      } else {
        setErrorMessage('Invalid username or password');
        setSessionStatus('Login failed - invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
      setSessionStatus(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if already authenticated
  if (isAuthenticated && !isLoading && !isSubmitting) {
    console.log('User is already authenticated, redirecting to dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-10 w-10 text-shield" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-shield" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded bg-destructive/15 text-destructive text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <div className="p-3 rounded bg-muted text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold">Session status:</span> {sessionStatus}
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
                <div className="text-center text-sm text-muted-foreground pt-2">
                  Default admin: username <span className="font-mono">admin</span> / password <span className="font-mono">admin123</span>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/')}>
              Return to homepage
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
