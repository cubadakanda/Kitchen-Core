import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllRatings, deleteRating } from '../../services/ratingService';
import { Link } from 'react-router-dom';

const ManageRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all ratings on component mount
  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await getAllRatings();
      console.log('Ratings fetched:', response);
      setRatings(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setError('Failed to fetch ratings');
      // Set mock data for testing
      setRatings([
        {
          id: 1,
          rating: 5,
          review_text: 'Excellent recipe!',
          created_at: '2023-06-10',
          User: { name: 'John Doe', email: 'john@example.com' },
          Recipe: { title: 'Nasi Goreng' }
        },
        {
          id: 2,
          rating: 4,
          review_text: 'Very good, will make again',
          created_at: '2023-06-09',
          User: { name: 'Jane Smith', email: 'jane@example.com' },
          Recipe: { title: 'Rendang' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteRating(ratingId);
      setRatings(ratings.filter(rating => rating.id !== ratingId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting rating:', error);
      setError('Failed to delete rating');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="icon is-small">
        <i className={`fas fa-star ${i < rating ? 'has-text-warning' : 'has-text-grey-lighter'}`}></i>
      </span>
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="has-text-centered py-6">
          <span className="icon is-large">
            <i className="fas fa-spinner fa-pulse fa-2x"></i>
          </span>
          <p className="mt-3">Loading ratings...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="level mb-5">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title is-3 primary-color">Manage Ratings</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <Link to="/admin/dashboard" className="button is-light">
                <span className="icon">
                  <i className="fas fa-arrow-left"></i>
                </span>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="notification is-danger">
            <button className="delete" onClick={() => setError('')}></button>
            {error}
          </div>
        )}

        {/* Ratings Table */}
        <div className="box">
          <div className="table-container">
            <table className="table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Recipe</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(rating => (
                  <tr key={rating.id}>
                    <td>{rating.id}</td>
                    <td>
                      <div>
                        <strong>{rating.User?.name || 'Anonymous'}</strong>
                        <br />
                        <small className="has-text-grey">{rating.User?.email || 'N/A'}</small>
                      </div>
                    </td>
                    <td>
                      <strong>{rating.Recipe?.title || 'Unknown Recipe'}</strong>
                    </td>
                    <td>
                      <div className="field is-grouped">
                        {renderStars(rating.rating)}
                        <span className="ml-2">({rating.rating}/5)</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rating.review_text || 'No review'}
                      </div>
                    </td>
                    <td>{formatDate(rating.created_at)}</td>
                    <td>
                      <div className="buttons are-small">
                        <button
                          className="button is-danger"
                          onClick={() => setDeleteConfirm(rating.id)}
                        >
                          <span className="icon">
                            <i className="fas fa-trash"></i>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {ratings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="has-text-centered">
                      No ratings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="modal is-active">
            <div className="modal-background" onClick={() => setDeleteConfirm(null)}></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">Confirm Delete</p>
                <button className="delete" onClick={() => setDeleteConfirm(null)}></button>
              </header>
              <section className="modal-card-body">
                <p>Are you sure you want to delete this rating? This action cannot be undone.</p>
              </section>
              <footer className="modal-card-foot">
                <button
                  className="button is-danger"
                  onClick={() => handleDeleteRating(deleteConfirm)}
                >
                  Delete
                </button>
                <button className="button" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
              </footer>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageRatings;
