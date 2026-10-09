import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function TestResults() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get('id');

  const [results, setResults] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = 'https://student-placement-platform.onrender.com/api/tests';

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API}/my-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data.data);

      if (resultId) {
        const found = res.data.data.find((r) => r._id === resultId);
        setLatest(found);
      } else if (res.data.data.length > 0) {
        setLatest(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level === 'Expert') return 'success';
    if (level === 'Advanced') return 'primary';
    if (level === 'Intermediate') return 'info';
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
        <h2 className="fw-bold">📊 Test Results</h2>
        <Link to="/student/tests" className="btn btn-outline-primary">
          ← Back to Tests
        </Link>
      </div>

      {/* Latest Result Highlight */}
      {latest && (
        <div className="card shadow border-0 mb-4 bg-light">
          <div className="card-body text-center">
            <h5 className="text-muted mb-2">Latest Test Result</h5>
            <h3 className="fw-bold mb-3">{latest.testId?.title}</h3>

            <div className="row">
              <div className="col-md-3">
                <h2 className="text-primary fw-bold">{latest.percentage}%</h2>
                <p className="text-muted small mb-0">Score</p>
              </div>
              <div className="col-md-3">
                <h2 className="text-success fw-bold">{latest.correctAnswers}</h2>
                <p className="text-muted small mb-0">Correct</p>
              </div>
              <div className="col-md-3">
                <h2 className="text-danger fw-bold">{latest.wrongAnswers}</h2>
                <p className="text-muted small mb-0">Wrong</p>
              </div>
              <div className="col-md-3">
                <span className={`badge bg-${getLevelColor(latest.skillLevel)} fs-6`}>
                  {latest.skillLevel}
                </span>
                <p className="text-muted small mb-0 mt-2">Skill Level</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Results */}
      <h5 className="fw-bold mb-3">All Attempts ({results.length})</h5>

      {results.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h4 className="text-muted">No test attempts yet</h4>
          <Link to="/student/tests" className="btn btn-primary mt-2">
            Take a Test →
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Test</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Level</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id}>
                  <td className="fw-bold">{r.testId?.title || 'Test'}</td>
                  <td>
                    <span className="badge bg-primary">{r.percentage}%</span>
                  </td>
                  <td className="text-success">{r.correctAnswers}</td>
                  <td className="text-danger">{r.wrongAnswers}</td>
                  <td>
                    <span className={`badge bg-${getLevelColor(r.skillLevel)}`}>
                      {r.skillLevel}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TestResults;