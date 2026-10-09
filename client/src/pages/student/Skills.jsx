import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Skills() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming',
    level: 'Beginner',
  });

  const API = 'http://localhost:5000/api/students';

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile`, authHeader);
      setProfile(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newSkill.name.trim()) {
      setError('Skill name is required');
      return;
    }

    try {
      const res = await axios.post(`${API}/skills`, newSkill, authHeader);
      setProfile(res.data.data);
      setMessage(`✅ "${newSkill.name}" added!`);
      setNewSkill({ name: '', category: 'Programming', level: 'Beginner' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDelete = async (skillId, skillName) => {
    if (!window.confirm(`Delete "${skillName}"?`)) return;
    try {
      const res = await axios.delete(`${API}/skills/${skillId}`, authHeader);
      setProfile(res.data.data);
      setMessage(`🗑️ "${skillName}" deleted`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleLevelChange = async (skillId, newLevel) => {
    try {
      const res = await axios.put(
        `${API}/skills/${skillId}`,
        { level: newLevel },
        authHeader
      );
      setProfile(res.data.data);
      setMessage('✅ Level updated!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      Beginner: 'secondary',
      Intermediate: 'info',
      Advanced: 'primary',
      Expert: 'success',
    };
    return colors[level] || 'secondary';
  };

  const getLevelWidth = (level) => {
    const widths = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };
    return widths[level] || 25;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const skills = profile?.skills || [];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛠️ My Skills</h2>
        <div className="badge bg-primary fs-6">{skills.length} Skills Added</div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Skill Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">➕ Add New Skill</h5>
          <form onSubmit={handleAdd}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. React, Python, SQL"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                >
                  <option>Programming</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Database</option>
                  <option>Tools</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  Add Skill
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Skills List */}
      {skills.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No skills added yet</h4>
          <p className="text-muted">Add your first skill to improve your readiness score!</p>
        </div>
      ) : (
        <div className="row g-3">
          {skills.map((skill) => (
            <div className="col-md-6 col-lg-4" key={skill._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="fw-bold mb-0">{skill.name}</h5>
                      <small className="text-muted">{skill.category}</small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(skill._id, skill.name)}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="mb-2">
                    <span className={`badge bg-${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </div>

                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar bg-${getLevelColor(skill.level)}`}
                      style={{ width: `${getLevelWidth(skill.level)}%` }}
                    ></div>
                  </div>

                  <select
                    className="form-select form-select-sm mt-2"
                    value={skill.level}
                    onChange={(e) => handleLevelChange(skill._id, e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;