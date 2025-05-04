
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FeaturedToggleProps {
  featured: boolean;
  setFeatured: (featured: boolean) => void;
}

export const FeaturedToggle = ({ featured, setFeatured }: FeaturedToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="featured"
        checked={featured}
        onCheckedChange={setFeatured}
      />
      <Label htmlFor="featured">Feature this post on the homepage</Label>
    </div>
  );
};
