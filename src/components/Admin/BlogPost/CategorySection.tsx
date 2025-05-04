
import React from 'react';
import { BlogCategory, categoryLabels } from '@/lib/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategorySectionProps {
  category: BlogCategory;
  setCategory: (category: BlogCategory) => void;
}

export const CategorySection = ({ category, setCategory }: CategorySectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select 
        value={category} 
        onValueChange={(value) => setCategory(value as BlogCategory)}
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
