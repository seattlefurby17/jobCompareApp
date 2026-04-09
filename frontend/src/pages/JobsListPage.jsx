import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobsList.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const canCompare = jobs.length >= 2;

  const toggleSelect = (id) => {
    setSelectedJobs(prev =>
      prev.includes(id)
        ? prev.filter(j => j !== id)
        : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/jobs/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setJobs(jobs.filter(job => job.id !== id));
        setConfirmDelete(null);
        setSelectedJobs(selectedJobs.filter(j => j !== id));
      })
      .catch(err => console.error("Error deleting job:", err));
  };

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">

          {/* Page Header */}
          <div className="page-header">
            <h1>Job List</h1>

            <button
              className="primary add-job-btn"
              onClick={() => navigate("/add")}
            >
              + Add Job
            </button>
          </div>

          {!canCompare && (
            <p className="muted-text">Add at least 2 jobs to compare.</p>
          )}

          {jobs.length === 0 && <p>No jobs found.</p>}

          <ul className="jobs-list">
            {jobs.map(job => (
              <li key={job.id} className="job-card">

                {/* Title + Checkbox + Badge */}
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

                {/* Action Buttons */}
                <div className="job-buttons">

                  <button
                    className="secondary btn-icon"
                    onClick={() => navigate(`/edit/${job.id}`)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M14.7 2.3a1 1 0 0 1 1.4 1.4l-9 9L5 13l.3-2.1 9-9zM4 15h12v2H4v-2z"/>
                    </svg>
                    Edit
                  </button>

                  <button
                    className="secondary btn-icon"
                    disabled={!canCompare}
                    onClick={() => navigate(`/compare?job1=${job.id}`)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z"/>
                    </svg>
                    Compare
                  </button>

                  <button
                    className="secondary btn-icon danger-text"
                    onClick={() => setConfirmDelete(job.id)}
                  >
                    <svg viewBox="0 0 20 20" className="icon">
                      <path d="M6 6h8l-1 10H7L6 6zm2-3h4l1 1h4v2H3V4h4l1-1z"/>
                    </svg>
                    Delete
                  </button>
                </div>

                {/* Delete Confirmation */}
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

          {/* Compare Selected Bar */}
          {selectedJobs.length >= 2 && (
            <div className="compare-selected-bar">

              {/* Warning only when selecting more than 2 */}
              {selectedJobs.length > 2 && (
                <p className="compare-warning">
                  You can only compare the first 2 selected jobs.
                </p>
              )}

              <div className="compare-actions">
                <button
                  className="secondary clear-selection-btn"
                  onClick={() => setSelectedJobs([])}
                >
                  Clear Selection
                </button>

                <button
                  className="primary"
                  onClick={() =>
                    navigate(
                      `/compare?job1=${selectedJobs[0]}&job2=${selectedJobs[1]}`
                    )
                  }
                >
                  Compare Selected ({selectedJobs.length})
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}
