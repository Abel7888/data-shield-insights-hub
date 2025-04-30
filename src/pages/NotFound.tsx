
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl font-bold text-shield mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/">Return to Homepage</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFound;
