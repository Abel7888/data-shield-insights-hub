
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';

const NewPost = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-6">Create New Post</h2>
      <BlogPostForm />
    </AdminLayout>
  );
};

export default NewPost;
