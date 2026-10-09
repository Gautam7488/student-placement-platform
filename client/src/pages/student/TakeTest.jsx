import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API = 'http://localhost:5000/api/tests';

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      const res = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTest(res.data.data.test);
      setQuestions(res.data.data.questions);
      setTimeLeft(res.data.data.test.duration * 60);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !window.confirm('Submit test? You cannot change answers after.')) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API}/${id}/submit`,
        { answers, timeTaken: test.duration * 60 - timeLeft },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/student/test-results?id=${res.data.data._id}`);
    } catch (err) {
      alert('Failed to submit: ' + (err.response?.data?.message || err.message));
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Test not available</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/student/tests')}>
          Back to Tests
        </button>
      </div>
    );
  }

  const q = questions[currentQ];
  const answered = Object.keys(answers).length;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0">{test.title}</h5>
            <small className="text-muted">
              Question {currentQ + 1} of {questions.length} • Answered: {answered}
            </small>
          </div>
          <div className={`badge fs-5 bg-${timeLeft < 60 ? 'danger' : 'primary'}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress mb-3" style={{ height: '8px' }}>
        <div
          className="progress-bar bg-primary"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">
          <h5 className="fw-bold mb-4">
            Q{currentQ + 1}. {q.question}
          </h5>

          <div className="list-group">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`list-group-item list-group-item-action ${
                  answers[q._id] === opt ? 'active' : ''
                }`}
                onClick={() => handleAnswer(q._id, opt)}
              >
                <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
        >
          ← Previous
        </button>

        <div>
          {currentQ < questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentQ(currentQ + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : '✅ Submit Test'}
            </button>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mt-4">
        <h6 className="fw-bold">Quick Navigation:</h6>
        <div className="d-flex flex-wrap gap-2">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                i === currentQ
                  ? 'btn-primary'
                  : answers[questions[i]._id]
                  ? 'btn-success'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setCurrentQ(i)}
              style={{ width: '40px' }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TakeTest;