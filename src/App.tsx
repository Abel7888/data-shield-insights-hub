
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManagePosts from "./pages/admin/ManagePosts";
import NewPost from "./pages/admin/NewPost";
import EditPost from "./pages/admin/EditPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/posts" element={<ManagePosts />} />
            <Route path="/admin/new-post" element={<NewPost />} />
            <Route path="/admin/edit-post/:id" element={<EditPost />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
