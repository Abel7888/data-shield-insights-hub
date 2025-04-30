
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { FileText } from 'lucide-react';

const NewPost = () => {
  return (
    <AdminLayout>
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-shield" />
        <h2 className="text-xl font-bold">Create New Post</h2>
      </div>
      <div className="bg-white dark:bg-black/20 rounded-lg shadow-sm p-6">
        <BlogPostForm />
      </div>
    </AdminLayout>
  );
};

export default NewPost;
