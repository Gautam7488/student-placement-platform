import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState({
    college: '',
    branch: '',
    semester: '',
    cgpa: 0,
    graduationYear: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    enrollmentNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000/api/students/profile';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.data) {
        setProfile({ ...profile, ...res.data.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await axios.put(API, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Profile updated successfully!');
      setProfile({ ...profile, profileCompletion: res.data.data.profileCompletion });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Update failed'));
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Profile</h2>
        <div className="badge bg-primary fs-6">
          {profile.profileCompletion || 0}% Complete
        </div>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">📚 Academic Information</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Enrollment Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="enrollmentNumber"
                  value={profile.enrollmentNumber || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">College</label>
                <input
                  type="text"
                  className="form-control"
                  name="college"
                  value={profile.college || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-control"
                  name="branch"
                  value={profile.branch || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Semester</label>
                <input
                  type="text"
                  className="form-control"
                  name="semester"
                  value={profile.semester || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-control"
                  name="cgpa"
                  value={profile.cgpa || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Graduation Year</label>
                <input
                  type="number"
                  className="form-control"
                  name="graduationYear"
                  value={profile.graduationYear || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">👤 Personal Information</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={profile.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dateOfBirth"
                  value={profile.dateOfBirth || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={profile.location || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
          {saving ? 'Saving...' : '💾 Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;