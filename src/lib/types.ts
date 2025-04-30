
export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  publishedDate: string;
  author: string;
  featured?: boolean;
}

export type BlogCategory = 'real-estate' | 'finance' | 'healthcare' | 'supply-chain' | 'cybersecurity';

export const categoryLabels: Record<BlogCategory, string> = {
  'real-estate': 'Real Estate',
  'finance': 'Finance',
  'healthcare': 'Healthcare',
  'supply-chain': 'Supply Chain',
  'cybersecurity': 'Cybersecurity'
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
