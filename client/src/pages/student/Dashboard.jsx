import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function StudentDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const API = 'https://student-placement-platform.onrender.com/api/students';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchApplications();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        'https://student-placement-platform.onrender.com/api/applications/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicationsCount(res.data.data.length);
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calculate readiness (basic - baad mein full formula)
  const calculateReadiness = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.skills?.length >= 3) score += 30;
    else if (profile.skills?.length > 0) score += profile.skills.length * 10;
    if (profile.projects?.length > 0) score += 20;
    if (profile.certifications?.length > 0) score += 15;
    if (profile.cgpa > 7) score += 15;
    if (profile.profileCompletion) score += profile.profileCompletion * 0.2;
    return Math.min(Math.round(score), 100);
  };

  const getReadinessCategory = (score) => {
    if (score >= 90) return { label: 'Excellent Candidate', color: 'success' };
    if (score >= 75) return { label: 'Strong Candidate', color: 'primary' };
    if (score >= 60) return { label: 'Job Ready', color: 'info' };
    if (score >= 40) return { label: 'Developing', color: 'warning' };
    return { label: 'Beginner', color: 'secondary' };
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const skillsCount = profile?.skills?.length || 0;
  const profileCompletion = profile?.profileCompletion || 0;
  const readiness = calculateReadiness();
  const readinessCat = getReadinessCategory(readiness);

  return (
    <div className="container py-4">
      {/* Welcome Header */}
      <div className="bg-primary text-white p-4 rounded-3 mb-4">
        <h2 className="fw-bold">Welcome, {user?.name}! 👋</h2>
        <p className="mb-0">Your placement journey starts here</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Profile Completion */}
        <div className="col-md-3">
          <Link to="/student/profile" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center p-3 h-100">
              <h3 className="text-primary fw-bold mb-1">{profileCompletion}%</h3>
              <p className="text-muted mb-0 small">Profile Completion</p>
              <div className="progress mt-2" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </Link>
        </div>

        {/* Placement Readiness */}
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 h-100">
            <h3 className={`text-${readinessCat.color} fw-bold mb-1`}>
              {readiness}%
            </h3>
            <p className="text-muted mb-0 small">Placement Readiness</p>
            <span className={`badge bg-${readinessCat.color} mt-2`}>
              {readinessCat.label}
            </span>
          </div>
        </div>

        {/* Applications (Clickable) */}
        <div className="col-md-3">
          <Link to="/student/applications" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center p-3 h-100">
              <h3 className="text-info fw-bold mb-1">{applicationsCount}</h3>
              <p className="text-muted mb-0 small">Applications</p>
            </div>
          </Link>
        </div>

        {/* Skills Added */}
        <div className="col-md-3">
          <Link to="/student/skills" className="text-decoration-none">
            <div className="card shadow-sm border-0 text-center p-3 h-100">
              <h3 className="text-warning fw-bold mb-1">{skillsCount}</h3>
              <p className="text-muted mb-0 small">Skills Added</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions - 6 Sections */}
      <h5 className="fw-bold mb-3">Quick Actions</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">👤 Complete Profile</h5>
              <p className="text-muted small">
                {profileCompletion >= 60
                  ? '✅ Profile is looking good!'
                  : 'Add your college, CGPA, and personal info'}
              </p>
              <Link to="/student/profile" className="btn btn-outline-primary btn-sm">
                Go to Profile →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">🛠️ Manage Skills</h5>
              <p className="text-muted small">
                {skillsCount >= 3
                  ? `✅ ${skillsCount} skills added`
                  : `Add at least 3 skills (${skillsCount}/3)`}
              </p>
              <Link to="/student/skills" className="btn btn-outline-primary btn-sm">
                Manage Skills →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">📋 My Applications</h5>
              <p className="text-muted small">
                {applicationsCount > 0
                  ? `You have ${applicationsCount} application(s)`
                  : 'Track your job applications'}
              </p>
              <Link to="/student/applications" className="btn btn-outline-primary btn-sm">
                View Applications →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">💼 Browse Jobs</h5>
              <p className="text-muted small">Find jobs matching your skills</p>
              <Link to="/jobs" className="btn btn-outline-primary btn-sm">
                View Jobs →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">🎯 Take Tests</h5>
              <p className="text-muted small">
                Aptitude & technical assessments to boost readiness
              </p>
              <Link to="/student/tests" className="btn btn-outline-primary btn-sm">
                Take Tests →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="fw-bold">📄 Resume Builder</h5>
              <p className="text-muted small">Build a professional resume</p>
              <Link to="/student/resume" className="btn btn-outline-primary btn-sm">
                Build Resume →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {profileCompletion < 100 && (
        <div className="alert alert-info mt-4">
          <h6 className="fw-bold">💡 Improvement Suggestions</h6>
          <ul className="mb-0 small">
            {profileCompletion < 60 && (
              <li>Complete your profile (College, CGPA, etc.)</li>
            )}
            {skillsCount < 3 && <li>Add at least 3 skills</li>}
            {(!profile?.projects || profile.projects.length === 0) && (
              <li>Add a project to showcase your work</li>
            )}
            {(!profile?.certifications || profile.certifications.length === 0) && (
              <li>Add a certification to boost your profile</li>
            )}
          </ul>
        </div>
      )}

      {/* Logout */}
      <div className="mt-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;