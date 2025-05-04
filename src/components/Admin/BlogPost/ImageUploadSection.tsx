
import React, { ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageUploadSectionProps {
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
}

export const ImageUploadSection = ({ handleImageChange, imagePreview }: ImageUploadSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Cover Image</Label>
      <Input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="cursor-pointer"
      />
      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Cover image preview"
            className="max-h-40 rounded-md"
          />
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Recommended size: 1200×630px. Max file size: 2MB
      </p>
    </div>
  );
};
