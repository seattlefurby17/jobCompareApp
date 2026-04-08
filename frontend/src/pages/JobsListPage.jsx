import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./JobsListPage.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const canCompare = jobs.length >= 2;

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/jobs/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setJobs(jobs.filter(job => job.id !== id));
        setConfirmDelete(null);
      })
      .catch(err => console.error("Error deleting job:", err));
  };

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1>Job List</h1>

          <div className="jobs-actions">
            <button className="secondary" onClick={() => navigate("/")}>
              Back to Home
            </button>

            <button className="secondary" onClick={() => navigate("/add")}>
              Add Job
            </button>

            <button
              className="secondary"
              disabled={!canCompare}
              onClick={() => navigate("/compare")}
            >
              Compare Jobs
            </button>
          </div>

          {!canCompare && (
            <p className="muted-text">Add at least 2 jobs to compare.</p>
          )}

          {jobs.length === 0 && <p>No jobs found.</p>}

          <ul className="jobs-list">
            {jobs.map(job => (
              <li key={job.id} className="job-card">
                <div className="job-header">
                  <strong>{job.title}</strong> — {job.company}
                </div>

                <div className="job-buttons">
                  <button
                    className="secondary"
                    onClick={() => navigate(`/edit/${job.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="secondary"
                    disabled={!canCompare}
                    onClick={() => navigate(`/compare?job1=${job.id}`)}
                  >
                    Compare
                  </button>

                  <button
                    className="danger"
                    onClick={() => setConfirmDelete(job.id)}
                  >
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
