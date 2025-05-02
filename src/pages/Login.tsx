
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Pre-fill admin credentials for convenience
  useEffect(() => {
    setUsername('admin');
    setPassword('admin123');
  }, []);
  
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
      const success = await login(username, password);
      
      if (success) {
        console.log('Login successful, redirecting to dashboard');
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    console.log('User is already authenticated, redirecting to dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-[350px]">
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
