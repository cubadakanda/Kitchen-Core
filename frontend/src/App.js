import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import SlidingAuth from './components/auth/SlidingAuth';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/user/NewHome')); // Using the new home component
const Profile = React.lazy(() => import('./pages/user/Profile'));
const Recipes = React.lazy(() => import('./pages/user/Recipes'));
const RecipeDetail = React.lazy(() => import('./pages/user/RecipeDetail'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ManageRecipes = React.lazy(() => import('./pages/admin/ManageRecipes'));
const AddRecipe = React.lazy(() => import('./pages/admin/AddRecipe'));
const EditRecipe = React.lazy(() => import('./pages/admin/EditRecipe'));
const ManageCategories = React.lazy(() => import('./pages/admin/ManageCategories'));
const ManageUsers = React.lazy(() => import('./pages/admin/ManageUsers'));
const AddUser = React.lazy(() => import('./pages/admin/AddUser'));
const EditUser = React.lazy(() => import('./pages/admin/EditUser'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="loading-fullscreen">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function AppRoutes() {
  // Simplified routing - always direct to auth first
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<SlidingAuth />} />
          <Route path="/login" element={<SlidingAuth />} />
          <Route path="/register" element={<SlidingAuth />} />
          
          {/* User Routes - Protected */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/recipes" element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          } />
          <Route path="/recipes/:id" element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />          <Route path="/admin/recipes" element={
            <AdminRoute>
              <ManageRecipes />
            </AdminRoute>
          } />          <Route path="/admin/recipes/add" element={
            <AdminRoute>
              <React.Suspense fallback={<Loading />}>
                <AddRecipe />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/recipes/edit/:id" element={
            <AdminRoute>
              <React.Suspense fallback={<Loading />}>
                <EditRecipe />
              </React.Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          } /><Route path="/admin/users" element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          } />
          <Route path="/admin/users/add" element={
            <AdminRoute>
              <AddUser />
            </AdminRoute>
          } />          <Route path="/admin/users/edit/:id" element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          } />
          
          {/* Always redirect to auth page as default */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

// Cleanup local storage before app loads


function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
