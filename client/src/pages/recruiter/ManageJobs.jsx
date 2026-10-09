import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ManageJobs() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = 'http://localhost:5000/api/jobs';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📋 Manage Jobs</h2>
        <Link to="/recruiter/post-job" className="btn btn-primary">
          ➕ Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No jobs posted yet</h4>
          <Link to="/recruiter/post-job" className="btn btn-primary mt-2">
            Post Your First Job →
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {jobs.map((job) => (
            <div className="col-md-6" key={job._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-1">{job.title}</h5>
                      <p className="text-muted mb-0 small">
                        🏢 {job.companyId?.name || 'Company'}
                      </p>
                    </div>
                    <span className={`badge bg-${job.isActive ? 'success' : 'secondary'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <p className="text-muted small mb-2">
                    📍 {job.location} • 💼 {job.jobType} • 💻 {job.workMode}
                  </p>

                  <p className="text-muted small mb-3">
                    💰 {job.salary} • 📝 {job.openings} openings
                  </p>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/recruiter/job/${job._id}/applicants`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      👥 Applicants
                    </Link>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(job._id, job.title)}
                    >
                      🗑️
                    </button>
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

export default ManageJobs;