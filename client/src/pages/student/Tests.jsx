import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function Tests() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = 'http://localhost:5000/api/tests';

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get(API);
      setTests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    if (cat === 'Technical') return 'primary';
    if (cat === 'Quantitative Aptitude') return 'success';
    if (cat === 'Logical Reasoning') return 'info';
    if (cat === 'Verbal Ability') return 'warning';
    return 'secondary';
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
        <h2 className="fw-bold">🎯 Available Tests</h2>
        <Link to="/student/test-results" className="btn btn-outline-primary">
          📊 My Results
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No tests available</h4>
          <p className="text-muted">Admin will add tests soon</p>
        </div>
      ) : (
        <div className="row g-3">
          {tests.map((test) => (
            <div className="col-md-6" key={test._id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-1">{test.title}</h5>
                    <span className={`badge bg-${getCategoryColor(test.category)}`}>
                      {test.category}
                    </span>
                  </div>
                  <p className="text-muted small">{test.description}</p>

                  <div className="mb-3">
                    <span className="badge bg-light text-dark me-2">
                      📝 {test.questionCount || 0} Questions
                    </span>
                    <span className="badge bg-light text-dark me-2">
                      ⏱️ {test.duration} min
                    </span>
                    <span className="badge bg-light text-dark">
                      🎯 Pass: {test.passingScore}%
                    </span>
                  </div>

                  <Link
                    to={`/student/test/${test._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Start Test →
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

export default Tests;