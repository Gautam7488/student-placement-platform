import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Company() {
  const { token } = useAuth();
  const [company, setCompany] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    location: '',
    companySize: '',
    logo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api/companies';

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(`${API}/my-company`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.data) setCompany(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await axios.post(API, company, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Company saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Save failed'));
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

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">🏢 Company Profile</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={company.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-control"
                  name="industry"
                  value={company.industry || ''}
                  onChange={handleChange}
                  placeholder="e.g. IT Services"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  className="form-control"
                  name="website"
                  value={company.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={company.location || ''}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Company Size</label>
                <select
                  className="form-select"
                  name="companySize"
                  value={company.companySize || ''}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>1-10</option>
                  <option>11-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>501-1000</option>
                  <option>1000+</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Logo URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="logo"
                  value={company.logo || ''}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={company.description || ''}
                  onChange={handleChange}
                  placeholder="Tell students about your company..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Company'}
        </button>
      </form>
    </div>
  );
}

export default Company;