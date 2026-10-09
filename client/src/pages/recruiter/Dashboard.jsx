import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RecruiterDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'recruiter') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const jobsRes = await axios.get(
        'http://localhost:5000/api/jobs/my-jobs',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const jobs = jobsRes.data.data || [];

      const appsRes = await axios.get(
        'http://localhost:5000/api/applications/recruiter',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const apps = appsRes.data.data || [];

      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter((j) => j.isActive).length,
        totalApplications: apps.length,
        shortlisted: apps.filter((a) => a.status === 'Shortlisted').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
      <div className="bg-primary text-white p-4 rounded-3 mb-4">
        <h2 className="fw-bold">Welcome, {user?.name}! 🏢</h2>
        <p className="mb-0">Manage your company and job postings</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-primary fw-bold mb-1">{stats.totalJobs}</h3>
            <p className="text-muted mb-0 small">Total Jobs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-success fw-bold mb-1">{stats.activeJobs}</h3>
            <p className="text-muted mb-0 small">Active Jobs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-info fw-bold mb-1">{stats.totalApplications}</h3>
            <p className="text-muted mb-0 small">Applications</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-warning fw-bold mb-1">{stats.shortlisted}</h3>
            <p className="text-muted mb-0 small">Shortlisted</p>
          </div>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Quick Actions</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">🏢 Company Profile</h5>
              <p className="text-muted small">Setup your company details</p>
              <Link to="/recruiter/company" className="btn btn-outline-primary btn-sm">
                Manage Company →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">➕ Post New Job</h5>
              <p className="text-muted small">Create a new job/internship</p>
              <Link to="/recruiter/post-job" className="btn btn-outline-primary btn-sm">
                Post Job →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">📋 Manage Jobs</h5>
              <p className="text-muted small">View and edit your postings</p>
              <Link to="/recruiter/manage-jobs" className="btn btn-outline-primary btn-sm">
                View Jobs →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">👥 Applicants</h5>
              <p className="text-muted small">Review student applications</p>
              <Link to="/recruiter/applicants" className="btn btn-outline-primary btn-sm">
                View Applicants →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default RecruiterDashboard;