import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PostJob() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    workMode: 'Remote',
    jobType: 'Full Time',
    salary: '',
    experience: 'Fresher',
    requiredSkills: '',
    preferredSkills: '',
    minCGPA: 0,
    eligibleBranches: '',
    openings: 1,
  });
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api';

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(`${API}/companies/my-company`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company) {
      setMessage('❌ Please create company profile first');
      return;
    }
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        companyId: company._id,
        requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        preferredSkills: form.preferredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        eligibleBranches: form.eligibleBranches.split(',').map((s) => s.trim()).filter(Boolean),
        minCGPA: Number(form.minCGPA),
        openings: Number(form.openings),
      };

      await axios.post(`${API}/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('✅ Job posted successfully!');
      setTimeout(() => navigate('/recruiter/manage-jobs'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to post job'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          ⚠️ <strong>Company profile nahi hai!</strong> Pehle company profile banao.
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/recruiter/company')}
        >
          Create Company Profile →
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">➕ Post New Job</h2>
      <p className="text-muted">Posting for: <strong>{company.name}</strong></p>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Job Details</h5>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Openings</label>
                <input
                  type="number"
                  className="form-control"
                  name="openings"
                  value={form.openings}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Work Mode</label>
                <select className="form-select" name="workMode" value={form.workMode} onChange={handleChange}>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Job Type</label>
                <select className="form-select" name="jobType" value={form.jobType} onChange={handleChange}>
                  <option>Full Time</option>
                  <option>Internship</option>
                  <option>Part Time</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Salary / Stipend</label>
                <input
                  type="text"
                  className="form-control"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. ₹8-12 LPA or ₹15,000/month"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  className="form-control"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. Fresher / 0-2 years"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Requirements</h5>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Required Skills (comma separated) *</label>
                <input
                  type="text"
                  className="form-control"
                  name="requiredSkills"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Preferred Skills (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="preferredSkills"
                  value={form.preferredSkills}
                  onChange={handleChange}
                  placeholder="Git, Docker"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="form-control"
                  name="minCGPA"
                  value={form.minCGPA}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Eligible Branches (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  name="eligibleBranches"
                  value={form.eligibleBranches}
                  onChange={handleChange}
                  placeholder="Computer Engineering, IT"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Posting...' : '🚀 Post Job'}
        </button>
      </form>
    </div>
  );
}

export default PostJob;