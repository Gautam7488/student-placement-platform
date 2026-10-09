import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  const API = `https://student-placement-platform.onrender.com/api/jobs/${id}`;

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(API, { headers });
      setJob(res.data.data.job);
      setMatch(res.data.data.match);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      setMessage('Only students can apply for jobs');
      return;
    }

    setApplying(true);
    setMessage('');

    try {
      await axios.post(
        'https://student-placement-platform.onrender.com/api/applications',
        {
          jobId: job._id,
          companyId: job.companyId._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Application submitted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to apply'));
    } finally {
      setApplying(false);
    }
  };

  const getMatchColor = (pct) => {
    if (pct >= 80) return 'success';
    if (pct >= 60) return 'primary';
    if (pct >= 40) return 'info';
    return 'warning';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h3>Job not found</h3>
        <Link to="/jobs" className="btn btn-primary mt-3">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/jobs" className="btn btn-outline-secondary btn-sm mb-3">
        ← Back to Jobs
      </Link>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h3 className="fw-bold mb-1">{job.title}</h3>
                  <p className="text-muted mb-0">
                    🏢 {job.companyId?.name || 'Company'}
                  </p>
                </div>
                <span className="badge bg-info fs-6">{job.jobType}</span>
              </div>

              <div className="mb-3">
                <span className="badge bg-light text-dark me-2 mb-1">
                  📍 {job.location || 'N/A'}
                </span>
                <span className="badge bg-light text-dark me-2 mb-1">
                  💻 {job.workMode}
                </span>
                <span className="badge bg-light text-dark me-2 mb-1">
                  💰 {job.salary}
                </span>
                <span className="badge bg-light text-dark mb-1">
                  📝 {job.experience || 'Fresher'}
                </span>
              </div>

              <h5 className="fw-bold mt-4">Job Description</h5>
              <p>{job.description}</p>

              <h5 className="fw-bold mt-4">Required Skills</h5>
              <div className="mb-3">
                {job.requiredSkills?.map((skill, i) => (
                  <span key={i} className="badge bg-secondary me-2 mb-1">
                    {skill}
                  </span>
                ))}
              </div>

              {job.preferredSkills?.length > 0 && (
                <>
                  <h5 className="fw-bold">Preferred Skills</h5>
                  <div className="mb-3">
                    {job.preferredSkills.map((skill, i) => (
                      <span key={i} className="badge bg-light text-dark me-2 mb-1">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <h5 className="fw-bold mt-3">Eligibility</h5>
              <ul>
                <li>Minimum CGPA: <strong>{job.minCGPA}</strong></li>
                <li>Openings: <strong>{job.openings}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {match && (
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">🎯 Skill Match</h5>

                <div className="text-center mb-3">
                  <div className={`display-4 fw-bold text-${getMatchColor(match.percentage)}`}>
                    {match.percentage}%
                  </div>
                  <span className={`badge bg-${getMatchColor(match.percentage)}`}>
                    {match.status}
                  </span>
                </div>

                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div
                    className={`progress-bar bg-${getMatchColor(match.percentage)}`}
                    style={{ width: `${match.percentage}%` }}
                  ></div>
                </div>

                {match.matched.length > 0 && (
                  <>
                    <h6 className="fw-bold text-success">✅ Matched Skills</h6>
                    <div className="mb-2">
                      {match.matched.map((s, i) => (
                        <span key={i} className="badge bg-success me-1 mb-1 small">
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {match.missing.length > 0 && (
                  <>
                    <h6 className="fw-bold text-danger">❌ Missing Skills</h6>
                    <div className="mb-2">
                      {match.missing.map((s, i) => (
                        <span key={i} className="badge bg-danger me-1 mb-1 small">
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {match.missing.length > 0 && (
                  <div className="alert alert-warning small mt-3 mb-0">
                    💡 <strong>Tip:</strong> Learn{' '}
                    <strong>{match.missing.join(', ')}</strong> to improve your match!
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h5 className="fw-bold mb-3">Ready to Apply?</h5>
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? 'Submitting...' : '🚀 Apply Now'}
              </button>
              <p className="text-muted small mt-2 mb-0">
                {user ? 'Your profile will be shared' : 'Login required to apply'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;