import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    workMode: '',
    skill: '',
  });

  const API = 'http://localhost:5000/api/jobs';

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, v);
      });
      const res = await axios.get(`${API}?${params.toString()}`);
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setFilters({ search: '', location: '', jobType: '', workMode: '', skill: '' });
    setTimeout(fetchJobs, 100);
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">💼 Browse Jobs & Internships</h2>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search job title..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option>Full Time</option>
                  <option>Internship</option>
                  <option>Part Time</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.workMode}
                  onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                >
                  <option value="">All Modes</option>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-primary w-100">Search</button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>↺</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No jobs found</h4>
          <p className="text-muted">Try different filters or check back later</p>
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
                      <p className="text-muted mb-1">
                        🏢 {job.companyId?.name || 'Company'}
                      </p>
                    </div>
                    <span className="badge bg-info">{job.jobType}</span>
                  </div>

                  <div className="mb-2">
                    <span className="badge bg-light text-dark me-1">📍 {job.location || 'N/A'}</span>
                    <span className="badge bg-light text-dark me-1">💻 {job.workMode}</span>
                    <span className="badge bg-light text-dark">💰 {job.salary}</span>
                  </div>

                  <p className="text-muted small mb-2">
                    {job.description?.substring(0, 100)}...
                  </p>

                  {job.requiredSkills?.length > 0 && (
                    <div className="mb-2">
                      {job.requiredSkills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="badge bg-secondary me-1 small">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                    View Details →
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

export default Jobs;