
import { Link } from 'react-router-dom';
import { BlogPost, categoryLabels } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine accent color based on category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'real-estate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'finance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'healthcare': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'supply-chain': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'cybersecurity': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:shadow-shield/10 group">
      <Link to={`/post/${post.slug}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Badge 
            className={`absolute top-3 right-3 ${getCategoryColor(post.category)}`}
          >
            {categoryLabels[post.category]}
          </Badge>
          
          {post.category === 'cybersecurity' && (
            <div className="absolute bottom-3 left-3 flex items-center bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
              <Shield className="h-3 w-3 text-shield mr-1" />
              <span className="text-xs font-medium text-white">Security Insight</span>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="pt-4">
        <Link to={`/post/${post.slug}`} className="block">
          <h3 className="font-bold leading-tight mb-2 text-lg hover:text-shield transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground border-t mt-auto">
        <div className="flex justify-between w-full pt-3">
          <span className="font-medium">{post.author}</span>
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
