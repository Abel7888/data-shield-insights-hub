
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { BlogPostForm } from '@/components/Admin/BlogPostForm';
import { getBlogPostById } from '@/lib/storage';
import { BlogPost } from '@/lib/types';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getBlogPostById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return <Navigate to="/admin/posts" replace />;
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-bold mb-6">Edit Post</h2>
      {post && <BlogPostForm post={post} />}
    </AdminLayout>
  );
};

export default EditPost;
