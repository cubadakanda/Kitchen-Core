import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const ManageUsers = () => {
  const { user: currentUser, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    gender: ''
  });
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAllUsers();
      if (response && Array.isArray(response)) {
        setUsers(response);
      } else {
        setError('Failed to fetch users data');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // Auto-hide success and error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal to add new user
  const handleAddNewUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      gender: ''
    });
    setShowModal(true);
    setError(null);
    setSuccess(null);
  };

  // Open modal to edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      gender: user.gender || ''
    });
    setShowModal(true);
    setError(null);
    setSuccess(null);
  };

  // Handle save user (create or update)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      
      if (editingUser) {
        // Update existing user
        response = await userService.updateUser(editingUser.id, formData);
        if (response.success !== false) {
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
          setSuccess('User updated successfully!');
          setShowModal(false);
        } else {
          setError(response.message || 'Failed to update user');
        }
      } else {
        // Create new user
        response = await userService.createUser({
          ...formData,
          password: 'password123' // Default password, should be changed by user
        });
        if (response.success !== false) {
          fetchUsers(); // Refresh the list
          setSuccess('User created successfully!');
          setShowModal(false);
        } else {
          setError(response.message || 'Failed to create user');
        }
      }
    } catch (err) {
      setError('An error occurred while saving user data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    try {
      const response = await userService.deleteUser(id);
      if (response.success !== false) {
        setUsers(users.filter(user => user.id !== id));
        setSuccess('User deleted successfully!');
        setConfirmDelete(null);
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting user');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Redirect if not admin
  if (!loading && (!currentUser || currentUser.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <div className="manage-users">        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
              <p className="text-purple-100 text-lg">Add, edit, and manage user accounts</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{filteredUsers.length}</div>
                    <div className="text-xs text-white/80">Total Users</div>
                  </div>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                  <div className="bg-purple-500 rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-xs text-white/80">Admin Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-grow">              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="px-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="lg:w-auto w-full mt-6 lg:mt-0">              <button 
                onClick={handleAddNewUser}
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm"
              >
                <span>+ Add New User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="relative mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse bg-blue-500 rounded-full h-4 w-4"></div>
                </div>
              </div>
              <p className="text-gray-500 font-medium">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-11 w-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-base">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{user.name}</div>
                              <div className="text-xs text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {user.gender || 'Not specified'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'N/A'}
                        </td>                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            {currentUser.id !== user.id && (
                              <button
                                onClick={() => setConfirmDelete(user)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center space-x-2"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                          currentPage === index + 1
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery || filterRole !== 'all' ? "No users found" : "No users available"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterRole !== 'all' 
                  ? "Try adjusting your search criteria or filters" 
                  : "Get started by adding your first user"}
              </p>
              <button 
                onClick={handleAddNewUser}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
              >
                Add New User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingUser ? 'Update user information' : 'Create a new user account'}
              </p>
            </div>
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Not specified</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    editingUser ? 'Update User' : 'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-600">Delete User</h2>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong className="text-gray-900">{confirmDelete.name}</strong>? 
                This will permanently remove their account and all associated data.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(confirmDelete.id)}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors duration-200 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
