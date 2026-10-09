import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Applicants() {
  const { jobId } = useParams();
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api';

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`${API}/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await axios.put(
        `${API}/applications/${appId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Status updated to ${newStatus}`);
      setApplications(
        applications.map((a) =>
          a._id === appId ? { ...a, status: newStatus } : a
        )
      );
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Update failed'));
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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/recruiter/manage-jobs" className="btn btn-outline-secondary btn-sm mb-3">
        ← Back to Jobs
      </Link>

      <h2 className="fw-bold mb-4">👥 Applicants ({applications.length})</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {applications.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No applicants yet</h4>
        </div>
      ) : (
        <div className="row g-3">
          {applications.map((app) => (
            <div className="col-md-6" key={app._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1">
                        {app.studentId?.name || 'Student'}
                      </h5>
                      <p className="text-muted mb-0 small">
                        📧 {app.studentId?.email}
                      </p>
                      {app.studentId?.phone && (
                        <p className="text-muted mb-0 small">
                          📱 {app.studentId.phone}
                        </p>
                      )}
                    </div>
                    <span className={`badge bg-${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-muted small mb-2">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-3">
                    <label className="form-label small fw-bold">Update Status:</label>
                    <select
                      className="form-select form-select-sm"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    >
                      <option>Applied</option>
                      <option>Under Review</option>
                      <option>Shortlisted</option>
                      <option>Interview</option>
                      <option>Selected</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applicants;