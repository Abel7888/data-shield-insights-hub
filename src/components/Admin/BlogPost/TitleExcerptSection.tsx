
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TitleExcerptSectionProps {
  title: string;
  setTitle: (title: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
}

export const TitleExcerptSection = ({ 
  title, 
  setTitle, 
  excerpt, 
  setExcerpt 
}: TitleExcerptSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of the post"
          required
        />
      </div>
    </>
  );
};
