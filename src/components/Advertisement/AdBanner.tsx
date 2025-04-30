
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  variant?: 'inline' | 'sidebar';
}

export function AdBanner({ variant = 'inline' }: AdBannerProps) {
  return (
    <Card className={`overflow-hidden ${variant === 'inline' ? 'my-8' : 'h-full'}`}>
      <div className="bg-gradient-to-r from-shield/10 to-shield-secondary/10 p-4 border border-shield/20">
        <div className="flex items-center gap-1 mb-2">
          <Megaphone className="h-3.5 w-3.5 text-shield" />
          <Badge variant="outline" className="text-xs bg-white/60 dark:bg-black/40">
            Advertisement
          </Badge>
        </div>

        <h3 className={`font-bold mb-2 ${variant === 'inline' ? 'text-xl' : 'text-lg'}`}>
          Advertise with Data Shield Blogs
        </h3>
        
        <p className={`text-muted-foreground mb-3 ${variant === 'inline' ? '' : 'text-sm'}`}>
          Reach professionals in real estate, finance, healthcare, supply chain, and cybersecurity.
        </p>
        
        <Button asChild size={variant === 'inline' ? 'default' : 'sm'} className="bg-shield hover:bg-shield-dark">
          <Link to="/advertise">Become a Sponsor</Link>
        </Button>
      </div>
    </Card>
  );
}
