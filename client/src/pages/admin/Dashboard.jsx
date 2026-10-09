import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('https://student-placement-platform.onrender.com/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data);
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
      <div className="bg-dark text-white p-4 rounded-3 mb-4">
        <h2 className="fw-bold">⚙️ Admin Dashboard</h2>
        <p className="mb-0">Welcome, {user?.name}</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-primary fw-bold mb-1">{stats?.totalStudents || 0}</h3>
            <p className="text-muted mb-0 small">Students</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-success fw-bold mb-1">{stats?.totalRecruiters || 0}</h3>
            <p className="text-muted mb-0 small">Recruiters</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-info fw-bold mb-1">{stats?.totalCompanies || 0}</h3>
            <p className="text-muted mb-0 small">Companies</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-warning fw-bold mb-1">{stats?.totalJobs || 0}</h3>
            <p className="text-muted mb-0 small">Jobs</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-primary fw-bold mb-1">{stats?.totalApplications || 0}</h3>
            <p className="text-muted mb-0 small">Applications</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h3 className="text-success fw-bold mb-1">{stats?.totalTests || 0}</h3>
            <p className="text-muted mb-0 small">Tests</p>
          </div>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Quick Actions</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">📝 Manage Tests</h5>
              <p className="text-muted small">Create tests and add questions</p>
              <Link to="/admin/tests" className="btn btn-outline-primary btn-sm">
                Manage Tests →
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">👥 Manage Users</h5>
              <p className="text-muted small">View all students & recruiters</p>
              <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
                View Users →
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

export default AdminDashboard;