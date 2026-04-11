import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobsList.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showTooManyHint, setShowTooManyHint] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // ⭐ Select up to 2 jobs
  const toggleSelect = (id) => {
    setSelectedJobs(prev => {
      if (prev.includes(id)) {
        return prev.filter(j => j !== id);
      }
      if (prev.length === 2) {
        setShowTooManyHint(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  // ⭐ Auto-hide hint
  useEffect(() => {
    if (!showTooManyHint) return;
    const t = setTimeout(() => setShowTooManyHint(false), 2000);
    return () => clearTimeout(t);
  }, [showTooManyHint]);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/jobs/${id}`, { method: "DELETE" })
      .then(() => {
        setJobs(prev => prev.filter(job => job.id !== id));
        setSelectedJobs(prev => prev.filter(j => j !== id));
        setConfirmDelete(null);
      })
      .catch(err => console.error("Error deleting job:", err));
  };

  const canCompare = selectedJobs.length === 2;

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">

          {/* ⭐ HEADER — Compare button always visible */}
          <div className="page-header">
            <h1 className="page-title">Job List</h1>

            <div className="jobs-header-actions">
              <button
                className="primary add-job-btn"
                onClick={() => navigate("/add")}
              >
                + Add Job
              </button>

              {selectedJobs.length > 0 && (
                <button
                  className="secondary clear-selection-btn"
                  onClick={() => setSelectedJobs([])}
                >
                  Clear Selection
                </button>
              )}

              <button
                className="primary compare-selected-btn"
                disabled={!canCompare}
                onClick={() => {
                  const [job1, job2] = selectedJobs;
                  navigate(`/compare?job1=${job1}&job2=${job2}`);
                }}
              >
                Compare Selected
                {selectedJobs.length > 0 && ` (${selectedJobs.length})`}
              </button>
            </div>
          </div>

          {/* ⭐ Hint when trying to select 3rd job */}
          {showTooManyHint && (
            <p className="compare-warning">You can only compare 2 jobs.</p>
          )}

          {jobs.length === 0 && <p>No jobs found.</p>}

          <ul className="jobs-list">
            {jobs.map(job => (
              <li key={job.id} className="job-card">

                {/* Title + checkbox + badge */}
                <div className="job-title">
                  <div className="title-left">
                    <input
                      type="checkbox"
                      className="job-select"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => toggleSelect(job.id)}
                    />

                    <span>
                      <strong>{job.title}</strong> — {job.company}
                    </span>
                  </div>

                  {job.is_current_job == 1 && (
                    <span className="current-job-badge">Current Job</span>
                  )}
                </div>

                {/* ⭐ View, Edit, Delete (Compare removed) */}
                <div className="job-buttons">

                  <button
                    className="secondary btn-icon"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M10 3c-5 0-9 5-9 7s4 7 9 7 9-5 9-7-4-7-9-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                    View
                  </button>

                  <button
                    className="secondary btn-icon"
                    onClick={() => navigate(`/edit/${job.id}`)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M14.7 2.3a1 1 0 0 1 1.4 1.4l-9 9L5 13l.3-2.1 9-9zM4 15h12v2H4v-2z" />
                    </svg>
                    Edit
                  </button>

                  <button
                    className="secondary btn-icon danger-text"
                    onClick={() => setConfirmDelete(job.id)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M6 6h8l-1 10H7L6 6zm2-3h4l1 1h4v2H3V4h4l1-1z" />
                    </svg>
                    Delete
                  </button>
                </div>

                {confirmDelete === job.id && (
                  <div className="delete-confirm">
                    <p>Are you sure you want to delete this job?</p>

                    <button
                      className="danger"
                      onClick={() => handleDelete(job.id)}
                    >
                      Yes, delete
                    </button>

                    <button
                      className="secondary"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </li>
            ))}
          </ul>

        </div>
      </div>

      <Footer />
    </>
  );
}
