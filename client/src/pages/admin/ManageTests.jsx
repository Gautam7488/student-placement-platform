import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function ManageTests() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    category: 'Quantitative Aptitude',
    description: '',
    duration: 30,
    passingScore: 40,
  });

  const [selectedTest, setSelectedTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'Medium',
  });

  const API = 'http://localhost:5000/api/admin';

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tests');
      setTests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/tests`, newTest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setNewTest({ title: '', category: 'Quantitative Aptitude', description: '', duration: 30, passingScore: 40 });
      fetchTests();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSelectTest = async (test) => {
    setSelectedTest(test);
    try {
      const res = await axios.get(`${API}/tests/${test._id}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/questions`,
        { ...newQ, testId: selectedTest._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewQ({ question: '', options: ['', '', '', ''], correctAnswer: '', difficulty: 'Medium' });
      handleSelectTest(selectedTest);
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Delete this test and all questions?')) return;
    try {
      await axios.delete(`${API}/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTests();
    } catch (err) {
      alert('Failed to delete');
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
        <h2 className="fw-bold">📝 Manage Tests</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '➕ Create Test'}
        </button>
      </div>

      {showForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Create New Test</h5>
            <form onSubmit={handleCreateTest}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTest.title}
                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={newTest.category}
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                  >
                    <option>Quantitative Aptitude</option>
                    <option>Logical Reasoning</option>
                    <option>Verbal Ability</option>
                    <option>Technical</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Duration (min)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newTest.duration}
                    onChange={(e) => setNewTest({ ...newTest, duration: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Passing Score (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newTest.passingScore}
                    onChange={(e) => setNewTest({ ...newTest, passingScore: Number(e.target.value) })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newTest.description}
                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Create Test
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-4">
          <h5 className="fw-bold mb-3">All Tests ({tests.length})</h5>
          {tests.length === 0 ? (
            <p className="text-muted">No tests yet. Create one!</p>
          ) : (
            tests.map((t) => (
              <div
                key={t._id}
                className={`card mb-2 shadow-sm border-0 ${
                  selectedTest?._id === t._id ? 'border-primary' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectTest(t)}
              >
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-1">{t.title}</h6>
                  <small className="text-muted">{t.category}</small>
                  <div className="mt-2">
                    <span className="badge bg-light text-dark me-1">
                      {t.questionCount || 0} Qs
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger float-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTest(t._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="col-md-8">
          {selectedTest ? (
            <>
              <h5 className="fw-bold mb-3">
                Questions for "{selectedTest.title}" ({questions.length})
              </h5>

              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h6 className="fw-bold">Add New Question</h6>
                  <form onSubmit={handleAddQuestion}>
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Question"
                        value={newQ.question}
                        onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
                        required
                      />
                    </div>
                    {newQ.options.map((opt, i) => (
                      <div key={i} className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Option ${String.fromCharCode(65 + i)}`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...newQ.options];
                            opts[i] = e.target.value;
                            setNewQ({ ...newQ, options: opts });
                          }}
                          required
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Correct Answer (exact match)"
                        value={newQ.correctAnswer}
                        onChange={(e) => setNewQ({ ...newQ, correctAnswer: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">
                      Add Question
                    </button>
                  </form>
                </div>
              </div>

              {questions.map((q, i) => (
                <div className="card mb-2 shadow-sm border-0" key={q._id}>
                  <div className="card-body p-3">
                    <strong>Q{i + 1}.</strong> {q.question}
                    <div className="mt-2">
                      {q.options.map((o, j) => (
                        <span
                          key={j}
                          className={`badge me-1 ${
                            o === q.correctAnswer ? 'bg-success' : 'bg-light text-dark'
                          }`}
                        >
                          {String.fromCharCode(65 + j)}. {o}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-5 bg-light rounded">
              <h5 className="text-muted">Select a test to manage questions</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageTests;