import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ padding: "2rem" }}>
      <h1>Job List</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => navigate("/")}>Back to Home</button>
        <button onClick={() => navigate("/add")} style={{ marginLeft: "1rem" }}>
          Add Job
        </button>
      </div>

      <button
        onClick={() => navigate("/compare")}
        disabled={!canCompare}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          cursor: canCompare ? "pointer" : "not-allowed",
          opacity: canCompare ? 1 : 0.5
        }}
      >
        Compare Jobs
      </button>

      {!canCompare && (
        <p style={{ color: "gray", marginTop: "-0.5rem" }}>
          Add at least 2 jobs to compare.
        </p>
      )}

      {jobs.length === 0 && <p>No jobs found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map(job => (
          <li
            key={job.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#fafafa"
            }}
          >
            <strong>{job.title}</strong> — {job.company}
            <br />

            <button
              style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
              onClick={() => navigate(`/edit/${job.id}`)}
            >
              Edit
            </button>

            <button
              style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
              disabled={!canCompare}
              onClick={() => navigate(`/compare?job1=${job.id}`)}
            >
              Compare
            </button>

            <button
              style={{ marginTop: "0.5rem", background: "red", color: "white" }}
              onClick={() => setConfirmDelete(job.id)}
            >
              Delete
            </button>

            {confirmDelete === job.id && (
              <div style={{ marginTop: "0.5rem", color: "red" }}>
                <p>Are you sure you want to delete this job?</p>
                <button
                  onClick={() => handleDelete(job.id)}
                  style={{ marginRight: "0.5rem" }}
                >
                  Yes, delete
                </button>
                <button onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
