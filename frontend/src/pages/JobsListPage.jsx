import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const canCompare = jobs.length >= 2;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job List</h1>

      {/* Global Compare Button */}
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
              borderRadius: "8px"
            }}
          >
            <strong>{job.title}</strong> — {job.company}
            <br />

            {/* Edit Button */}
            <button
              style={{ marginTop: "0.5rem", marginRight: "0.5rem" }}
              onClick={() => navigate(`/edit/${job.id}`)}
            >
              Edit Job
            </button>

            {/* Compare Button (disabled if < 2 jobs) */}
            <button
              style={{ marginTop: "0.5rem" }}
              disabled={!canCompare}
              onClick={() => navigate(`/compare?job1=${job.id}`)}
            >
              Compare
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
