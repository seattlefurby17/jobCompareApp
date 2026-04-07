import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job List</h1>

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
            <button
              style={{ marginTop: "0.5rem" }}
              onClick={() => navigate(`/edit/${job.id}`)}
            >
              Edit Job
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
