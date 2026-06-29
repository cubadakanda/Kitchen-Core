import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { userService } from '../../services/userService';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user: currentUser, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    gender: ''
  });

  // Fetch user data either from location state or from API
  useEffect(() => {
    const fetchUser = async () => {
      setIsFetching(true);
      try {
        // First try to get user data from location state
        if (location.state && location.state.userData) {
          const userData = location.state.userData;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || 'user',
            gender: userData.gender || ''
          });
          setIsFetching(false);
          return;
        }
          // If no state data, fetch from API
        const response = await userService.getUserById(id);
        if (response && response.success !== false) {
          setFormData({
            name: response.name || '',
            email: response.email || '',
            role: response.role || 'user',
            gender: response.gender || ''
          });
        } else {
          setError('Failed to fetch user data');
          setTimeout(() => {
            navigate('/admin/users');
          }, 3000);
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
        console.error(err);
        setTimeout(() => {
          navigate('/admin/users');
        }, 3000);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, location.state, navigate]);

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

  // Handle save user (update)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);    try {
      console.log("Submitting with form data:", formData);
      console.log("User ID:", id);
      
      const response = await userService.updateUser(id, formData);
      console.log("Response from update API:", response);
      
      // Fixed condition check
      if (response && response.success !== false) {
        setSuccess('User updated successfully!');
        setTimeout(() => {
          navigate('/admin/users'); // Navigate back to users list after success
        }, 2000);
      } else {
        setError(response?.message || 'Failed to update user');
      }
    } catch (err) {
      setError('An error occurred while updating user data');
      console.error("Error in handleSaveUser:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not admin
  if (!loading && (!currentUser || currentUser.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }
  if (isFetching) {
    return (
      <AdminLayout>
        <div className="section has-text-centered">
          <div className="container">
            <div className="box p-6" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <span className="icon is-large has-text-primary">
                  <i className="fas fa-spinner fa-pulse fa-3x"></i>
                </span>
                <p className="mt-4 is-size-5 has-text-grey">Loading user data...</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }  return (
    <AdminLayout>
      <div className="container">
        {/* Header Section */}
        <section className="section is-small pb-0">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title has-text-weight-bold is-2">
                  <span className="icon-text">
                    <span className="icon mr-3 has-text-primary">
                      <i className="fas fa-user-edit"></i>
                    </span>
                    <span>Edit User</span>
                  </span>
                </h1>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <button 
                  className="button is-primary is-outlined is-medium"
                  onClick={() => navigate('/admin/users')}
                >
                  <span className="icon">
                    <i className="fas fa-arrow-left"></i>
                  </span>
                  <span>Back to Users</span>
                </button>
              </div>
            </div>
          </div>
          <p className="subtitle is-5 has-text-grey">
            Update information for {formData.name || 'this user'}
          </p>
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

        {/* User Form Card */}
        <section className="section">
          <div className="columns">
            <div className="column is-8 is-offset-2">
              <div className="card admin-card">
                <header className="card-header">
                  <p className="card-header-title">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-user-edit"></i>
                      </span>
                      <span>User Information</span>
                    </span>
                  </p>
                </header>
                
                <div className="card-content">
                  <form onSubmit={handleSaveUser}>
                    <div className="field">
                      <label className="label">Full Name *</label>
                      <div className="control has-icons-left">
                        <input 
                          className="input" 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Email Address *</label>
                      <div className="control has-icons-left">
                        <input 
                          className="input" 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-envelope"></i>
                        </span>
                      </div>
                    </div>

                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">User Role *</label>
                          <div className="control has-icons-left">
                            <div className="select is-fullwidth">
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="user">Regular User</option>
                                <option value="admin">Administrator</option>
                              </select>
                            </div>
                            <span className="icon is-small is-left">
                              <i className="fas fa-user-tag"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label">Gender</label>
                          <div className="control has-icons-left">
                            <div className="select is-fullwidth">
                              <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                              >
                                <option value="">Not specified</option>
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                              </select>
                            </div>
                            <span className="icon is-small is-left">
                              <i className="fas fa-venus-mars"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="message is-warning is-light mt-5">
                      <div className="message-body">
                        <div className="is-flex">
                          <span className="icon mr-2 has-text-warning">
                            <i className="fas fa-exclamation-triangle"></i>
                          </span>
                          <div>
                            <p className="has-text-weight-medium">Password Information</p>
                            <p className="is-size-7 mt-1">User passwords cannot be changed from this form. Users must change their own passwords through their profile settings.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="field is-grouped is-grouped-right mt-5 pt-4" style={{ borderTop: '1px solid #eee' }}>
                      <div className="control">
                        <button 
                          type="button" 
                          className="button is-light"
                          onClick={() => navigate('/admin/users')}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="control">
                        <button 
                          type="submit" 
                          className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                          disabled={isLoading}
                        >
                          <span className="icon">
                            <i className="fas fa-save"></i>
                          </span>
                          <span>Update User</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
