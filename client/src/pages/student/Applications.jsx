import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Applications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const API = 'https://student-placement-platform.onrender.com/api/applications/me';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: 'secondary',
      'Under Review': 'info',
      Shortlisted: 'primary',
      Interview: 'warning',
      Selected: 'success',
      Rejected: 'danger',
    };
    return colors[status] || 'secondary';
  };

  const filteredApps =
    filter === 'All'
      ? applications
      : applications.filter((a) => a.status === filter);

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  // Stats
  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    selected: applications.filter((a) => a.status === 'Selected').length,
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📋 My Applications</h2>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-primary fw-bold mb-0">{stats.total}</h3>
            <p className="text-muted mb-0 small">Total Applications</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-primary fw-bold mb-0">{stats.shortlisted}</h3>
            <p className="text-muted mb-0 small">Shortlisted</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-warning fw-bold mb-0">{stats.interview}</h3>
            <p className="text-muted mb-0 small">Interviews</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-success fw-bold mb-0">{stats.selected}</h3>
            <p className="text-muted mb-0 small">Selected</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-3">
        {statuses.map((s) => (
          <button
            key={s}
            className={`btn btn-sm me-2 mb-2 ${
              filter === s ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No applications found</h4>
          <p className="text-muted">
            {filter === 'All'
              ? "You haven't applied for any jobs yet."
              : `No applications with status "${filter}"`}
          </p>
          <Link to="/jobs" className="btn btn-primary mt-2">
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {filteredApps.map((app) => (
            <div className="col-md-6" key={app._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1">{app.jobId?.title || 'Job'}</h5>
                      <p className="text-muted mb-0">
                        🏢 {app.companyId?.name || 'Company'}
                      </p>
                    </div>
                    <span className={`badge bg-${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-muted small mb-2">
                    📍 {app.jobId?.location} • 💼 {app.jobId?.jobType}
                  </p>

                  <p className="text-muted small mb-2">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>

                  <Link
                    to={`/jobs/${app.jobId?._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Job →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;