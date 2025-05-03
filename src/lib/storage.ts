
// Re-export all functions from our modular services
// This maintains compatibility with existing code while allowing us to refactor

// Blog Post functions
export {
  getBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  getBlogPostsByCategory,
  getRecentBlogPosts,
  getFeaturedBlogPosts,
  saveBlogPost,
  deleteBlogPost,
  generateId,
  generateSlug
} from './services/blogService';

// User functions
export {
  getUsers,
  getUserById,
  getUserByUsername,
  saveUser
} from './services/userService';

// Authentication functions
export {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  getCurrentUser
} from './services/authService';
