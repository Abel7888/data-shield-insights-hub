
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBlogPosts, deleteBlogPost } from '@/lib/storage';
import { BlogPost, categoryLabels } from '@/lib/types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ManagePosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const allPosts = getBlogPosts();
    setPosts(allPosts);
    setFilteredPosts(allPosts);
  };

  // Filter posts when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredPosts(
        posts.filter(
          post =>
            post.title.toLowerCase().includes(term) ||
            post.excerpt.toLowerCase().includes(term) ||
            categoryLabels[post.category].toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, posts]);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      if (deleteBlogPost(postToDelete.id)) {
        toast({
          title: 'Post Deleted',
          description: `"${postToDelete.title}" has been permanently deleted.`,
        });
        
        // Update state to reflect deletion by reloading posts from storage
        loadPosts();
      } else {
        toast({
          title: 'Error',
          description: 'There was an error deleting the post.',
          variant: 'destructive',
        });
      }
    }
    
    setDeleteConfirmOpen(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Posts</h2>
        <Button asChild>
          <Link to="/admin/new-post">Create New Post</Link>
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link 
                      to={`/post/${post.slug}`} 
                      target="_blank"
                      className="font-medium hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabels[post.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(post.publishedDate)}</TableCell>
                  <TableCell>
                    {post.featured ? (
                      <Badge>Featured</Badge>
                    ) : (
                      <Badge variant="outline">Published</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/admin/edit-post/${post.id}`}>Edit</Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteClick(post)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No posts matching your search.' : 'No posts found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{postToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ManagePosts;
