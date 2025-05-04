
import React from 'react';

interface FormHeaderProps {
  formError: string | null;
}

export const FormHeader = ({ formError }: FormHeaderProps) => {
  if (!formError) return null;
  
  return (
    <div className="p-3 text-sm font-medium text-white bg-destructive rounded-md">
      {formError}
    </div>
  );
};
