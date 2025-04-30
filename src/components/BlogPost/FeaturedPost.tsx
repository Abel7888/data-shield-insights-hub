
import { Link } from 'react-router-dom';
import { BlogPost, categoryLabels } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedPostProps {
  post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-lg shadow-md mb-8">
      <div className="md:grid md:grid-cols-12 h-full">
        <div className="md:col-span-7 relative h-64 md:h-full overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="bg-white p-6 md:col-span-5 flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-3">
            {categoryLabels[post.category]}
          </Badge>
          
          <Link to={`/post/${post.slug}`} className="block">
            <h2 className="text-2xl font-bold hover:text-shield transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-muted-foreground my-4">
            {post.excerpt}
          </p>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
            <span>{post.author}</span>
            <span>{formattedDate}</span>
          </div>
          
          <Button asChild className="w-fit">
            <Link to={`/post/${post.slug}`}>Read Article</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
