import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SlidingAuth from './components/auth/SlidingAuth';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/user/Home'));
const Profile = React.lazy(() => import('./pages/user/Profile'));
const Recipes = React.lazy(() => import('./pages/user/Recipes'));
const RecipeDetail = React.lazy(() => import('./pages/user/RecipeDetail'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageRecipes = React.lazy(() => import('./pages/admin/ManageRecipes'));
const ManageCategories = React.lazy(() => import('./pages/admin/ManageCategories'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="loading-fullscreen">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>        <React.Suspense fallback={<Loading />}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<SlidingAuth />} />
            <Route path="/login" element={<SlidingAuth />} />
            <Route path="/register" element={<SlidingAuth />} />
            
            {/* User Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/recipes" element={<ManageRecipes />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            
            {/* Redirect to auth as default */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
