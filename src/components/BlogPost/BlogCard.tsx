
import { Link } from 'react-router-dom';
import { BlogPost, categoryLabels } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className={`overflow-hidden ${featured ? 'h-full' : ''}`}>
      <Link to={`/post/${post.slug}`} className="block">
        <div className={`aspect-video relative overflow-hidden ${featured ? 'md:h-56' : 'h-48'}`}>
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <Badge 
            variant="secondary"
            className="absolute top-3 right-3"
          >
            {categoryLabels[post.category]}
          </Badge>
        </div>
      </Link>
      
      <CardContent className={`pt-4 ${featured ? 'pb-0' : ''}`}>
        <Link to={`/post/${post.slug}`} className="block">
          <h3 className={`font-bold leading-tight mb-2 ${featured ? 'text-xl' : 'text-lg'} hover:text-shield transition-colors`}>
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <span>{post.author}</span>
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
