import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">
                Get Placement Ready 🚀
              </h1>
              <p className="lead mt-3">
                Track your skills, take assessments, and connect with top companies.
                Your journey from student to professional starts here.
              </p>
              <div className="mt-4">
                <Link to="/register" className="btn btn-light btn-lg me-2">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <div style={{ fontSize: '10rem' }}>🎯</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <h3 className="text-primary fw-bold">500+</h3>
              <p>Students</p>
            </div>
            <div className="col-md-3">
              <h3 className="text-primary fw-bold">50+</h3>
              <p>Companies</p>
            </div>
            <div className="col-md-3">
              <h3 className="text-primary fw-bold">200+</h3>
              <p>Jobs</p>
            </div>
            <div className="col-md-3">
              <h3 className="text-primary fw-bold">85%</h3>
              <p>Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Features</h2>
          <div className="row g-4">
            {[
              { icon: '📝', title: 'Aptitude Tests', desc: 'Practice quantitative, logical and verbal tests' },
              { icon: '💻', title: 'Technical Assessments', desc: 'Test your C, C++, Java, Python, JS skills' },
              { icon: '📊', title: 'Readiness Score', desc: 'Get your placement readiness percentage' },
              { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Know what skills you need to learn' },
              { icon: '💼', title: 'Job Matching', desc: 'Find jobs that match your skills' },
              { icon: '📄', title: 'Resume Builder', desc: 'Create a professional resume instantly' },
            ].map((f, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 shadow-sm border-0 text-center p-3">
                  <div style={{ fontSize: '3rem' }}>{f.icon}</div>
                  <h5 className="fw-bold mt-3">{f.title}</h5>
                  <p className="text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-5 text-center">
        <div className="container">
          <h2 className="fw-bold">Ready to start your journey?</h2>
          <p className="lead mt-2">Join thousands of students preparing for placements</p>
          <Link to="/register" className="btn btn-light btn-lg mt-3">
            Register Now — It's Free
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;