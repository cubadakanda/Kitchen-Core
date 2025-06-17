import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { user: currentUser, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [modalActive, setModalActive] = useState(false);

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

  // Navigate to add new user page
  const handleAddNewUser = () => {
    navigate('/admin/users/add');
  };

  // Navigate to edit user page
  const handleEditUser = (user) => {
    navigate(`/admin/users/edit/${user.id}`, { 
      state: { 
        userData: user 
      } 
    });
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (user) => {
    setConfirmDelete(user);
    setModalActive(true);
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    setIsLoading(true);
    try {
      const response = await userService.deleteUser(id);
      if (response.success !== false) {
        setUsers(users.filter(user => user.id !== id));
        setSuccess('User deleted successfully!');
        closeModal();
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

  const closeModal = () => {
    setModalActive(false);
    setConfirmDelete(null);
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

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get page numbers as array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Render role badge with Bulma
  const renderRoleBadge = (role) => {
    let badgeClass = '';
    
    switch(role) {
      case 'admin':
        badgeClass = 'is-primary';
        break;
      case 'user':
        badgeClass = 'is-info';
        break;
      default:
        badgeClass = 'is-light';
    }
    
    return (
      <span className={`tag ${badgeClass}`}>{role}</span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="has-text-centered my-6">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p className="mt-3">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AdminLayout>
      <div className="container">
        {/* Header and Stats Section */}
        <section className="section is-small pb-0">
          <div className="columns is-variable is-8">
            <div className="column">
              <div className="level">
                <div className="level-left">
                  <div className="level-item">
                    <h1 className="title has-text-weight-bold is-2">
                      <span className="icon-text">
                        <span className="icon mr-3 has-text-primary">
                          <i className="fas fa-users"></i>
                        </span>
                        <span>Manage Users</span>
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <button 
                      className="button is-primary is-medium" 
                      onClick={handleAddNewUser}
                    >
                      <span className="icon">
                        <i className="fas fa-user-plus"></i>
                      </span>
                      <span>Add New User</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="columns is-multiline mt-5">
            <div className="column is-3">
              <div className="box stat-card">
                <div className="is-flex is-align-items-center">
                  <div className="stat-card-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <div className="stat-card-value">{users.length}</div>
                    <div className="stat-card-title">Total Users</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box stat-card">
                <div className="is-flex is-align-items-center">
                  <div className="stat-card-icon" style={{background: '#23d160'}}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <div className="stat-card-value">{users.filter(u => u.role === 'user').length}</div>
                    <div className="stat-card-title">Regular Users</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box stat-card">
                <div className="is-flex is-align-items-center">
                  <div className="stat-card-icon" style={{background: '#ff3860'}}>
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <div className="stat-card-value">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="stat-card-title">Admins</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box stat-card">
                <div className="is-flex is-align-items-center">
                  <div className="stat-card-icon" style={{background: '#3273dc'}}>
                    <i className="fas fa-search"></i>
                  </div>
                  <div>
                    <div className="stat-card-value">{filteredUsers.length}</div>
                    <div className="stat-card-title">Filtered Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Messages */}
        <section className="section is-small py-4">
          {success && (
            <div className="notification is-success is-light">
              <button className="delete" onClick={() => setSuccess(null)}></button>
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-check-circle"></i>
                </span>
                <span>{success}</span>
              </span>
            </div>
          )}

          {error && (
            <div className="notification is-danger is-light">
              <button className="delete" onClick={() => setError(null)}></button>
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-exclamation-circle"></i>
                </span>
                <span>{error}</span>
              </span>
            </div>
          )}
        </section>

        {/* Search and Filter Controls */}
        <section className="section is-small py-4">
          <div className="card admin-card">
            <div className="card-content">
              <div className="columns is-multiline">
                <div className="column is-8">
                  <div className="field">
                    <label className="label">Search Users</label>
                    <div className="control has-icons-left">
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <span className="icon is-left">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <div className="field">
                    <label className="label">Filter by Role</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select 
                          value={filterRole} 
                          onChange={(e) => {
                            setFilterRole(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admins Only</option>
                          <option value="user">Users Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Users Table */}
        <section className="section is-small py-4">
          <div className="card admin-card">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon-text">
                  <span className="icon">
                    <i className="fas fa-table"></i>
                  </span>
                  <span>User List</span>
                </span>
              </p>
            </header>
            <div className="card-content admin-card-content p-0">
              {isLoading ? (
                <div className="has-text-centered py-6">
                  <span className="icon is-large">
                    <i className="fas fa-spinner fa-pulse fa-2x"></i>
                  </span>
                  <p className="mt-3">Loading users...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="table-container">
                  <table className="table is-fullwidth is-striped is-hoverable admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Gender</th>
                        <th>Created</th>
                        <th className="has-text-centered">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="is-flex is-align-items-center">
                              <figure className="image is-40x40 mr-3">
                                <div className="has-background-primary is-flex is-align-items-center is-justify-content-center has-text-white has-text-weight-bold" 
                                     style={{borderRadius: '8px', width: '40px', height: '40px'}}>
                                  {user.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                              </figure>
                              <div>
                                <p className="has-text-weight-semibold">{user.name}</p>
                                <p className="is-size-7 has-text-grey">ID: {user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{renderRoleBadge(user.role)}</td>
                          <td><span className="tag is-light">{user.gender || 'Not specified'}</span></td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <div className="buttons is-centered">
                              <button 
                                className="button is-small is-info is-light"
                                onClick={() => handleEditUser(user)}
                                title="Edit user"
                              >
                                <span className="icon is-small">
                                  <i className="fas fa-edit"></i>
                                </span>
                                <span>Edit</span>
                              </button>
                              {currentUser.id !== user.id && (
                                <button 
                                  className="button is-small is-danger is-light"
                                  onClick={() => showDeleteConfirmation(user)}
                                  title="Delete user"
                                >
                                  <span className="icon is-small">
                                    <i className="fas fa-trash-alt"></i>
                                  </span>
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
              ) : (
                <div className="has-text-centered py-6">
                  <span className="icon is-large">
                    <i className="fas fa-user-slash fa-3x has-text-grey-light"></i>
                  </span>
                  <p className="mt-3 has-text-grey">No users found matching your filters</p>
                  <button 
                    className="button is-primary mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterRole('all');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <footer className="card-footer">
                <div className="card-footer-item">
                  {filteredUsers.length > usersPerPage && (
                    <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                      <a 
                        className="pagination-previous" 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </a>
                      <a 
                        className="pagination-next" 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </a>
                      <ul className="pagination-list">
                        {totalPages > 5 && currentPage > 3 && (
                          <>
                            <li><a className="pagination-link" onClick={() => paginate(1)}>1</a></li>
                            <li><span className="pagination-ellipsis">&hellip;</span></li>
                          </>
                        )}
                        
                        {pageNumbers.map(number => {
                          // Show current page and 2 pages before and after
                          if (
                            number === 1 ||
                            number === totalPages ||
                            (number >= currentPage - 2 && number <= currentPage + 2)
                          ) {
                            return (
                              <li key={number}>
                                <a 
                                  className={`pagination-link ${number === currentPage ? 'is-current' : ''}`}
                                  onClick={() => paginate(number)}
                                  aria-label={`Go to page ${number}`}
                                >
                                  {number}
                                </a>
                              </li>
                            );
                          }
                          return null;
                        })}
                        
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <li><span className="pagination-ellipsis">&hellip;</span></li>
                            <li>
                              <a 
                                className="pagination-link" 
                                onClick={() => paginate(totalPages)}
                              >
                                {totalPages}
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </nav>
                  )}
                </div>
              </footer>
            )}
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        <div className={`modal ${modalActive ? 'is-active' : ''}`}>
          <div className="modal-background" onClick={closeModal}></div>
          <div className="modal-card">
            <header className="modal-card-head has-background-danger-light">
              <p className="modal-card-title">
                <span className="icon-text">
                  <span className="icon has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                  <span>Confirm Deletion</span>
                </span>
              </p>
              <button className="delete" aria-label="close" onClick={closeModal}></button>
            </header>
            <section className="modal-card-body">
              {confirmDelete && (
                <div>
                  <p className="mb-4">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                  <div className="box">
                    <article className="media">
                      <div className="media-left">
                        <figure className="image is-48x48">
                          <div className="has-background-primary is-flex is-align-items-center is-justify-content-center has-text-white has-text-weight-bold" 
                               style={{borderRadius: '8px', width: '48px', height: '48px'}}>
                            {confirmDelete.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        </figure>
                      </div>
                      <div className="media-content">
                        <div className="content">
                          <p>
                            <strong>{confirmDelete.name}</strong> <small>{confirmDelete.email}</small>
                            <br />
                            Role: <span className={`tag ${confirmDelete.role === 'admin' ? 'is-primary' : 'is-info'} mt-1`}>
                              {confirmDelete.role}
                            </span>
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              )}
            </section>
            <footer className="modal-card-foot">
              <button 
                className={`button is-danger ${isLoading ? 'is-loading' : ''}`}
                onClick={() => confirmDelete && handleDeleteUser(confirmDelete.id)}
                disabled={isLoading}
              >
                <span className="icon">
                  <i className="fas fa-trash-alt"></i>
                </span>
                <span>Delete User</span>
              </button>
              <button className="button" onClick={closeModal}>Cancel</button>
            </footer>
          </div>
        </div>      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
