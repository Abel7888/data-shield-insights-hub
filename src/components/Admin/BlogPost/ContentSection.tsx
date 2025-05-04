
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentSectionProps {
  content: string;
  setContent: (content: string) => void;
}

export const ContentSection = ({ content, setContent }: ContentSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post content here (supports Markdown)"
        className="min-h-[300px]"
        required
      />
      <p className="text-xs text-muted-foreground">
        Use Markdown for formatting. Headings: # H1, ## H2; Lists: - item; Bold: **text**; Links: [title](url)
      </p>
    </div>
  );
};
