
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const FormActions = ({ isSubmitting, isEditMode }: FormActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-4">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Publishing...'}
          </>
        ) : isEditMode ? 'Update Post' : 'Publish Post'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/admin/posts')}
      >
        Cancel
      </Button>
    </div>
  );
};
