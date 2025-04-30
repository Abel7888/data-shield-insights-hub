
import { Link } from 'react-router-dom';
import { categoryLabels } from '@/lib/types';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/2f2297b1-5bc3-482a-8159-3f9f191889b0.png" alt="Data Shield Blogs" className="h-8 w-8" />
              <span className="font-bold text-xl text-shield-dark">Data Shield Blogs</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The leading source for insights on emerging technologies in real estate, finance, healthcare, and supply chain.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-4">Categories</h4>
            <ul className="space-y-2">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <li key={key}>
                  <Link 
                    to={`/category/${key}`}
                    className="text-sm text-muted-foreground hover:text-shield transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/"
                  className="text-sm text-muted-foreground hover:text-shield transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-shield transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Data Shield Blogs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-shield transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-shield transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
