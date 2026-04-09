import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/ComparePage.css";

export default function ComparePage() {
  const [jobs, setJobs] = useState([]);
  const [job1, setJob1] = useState(null);
  const [job2, setJob2] = useState(null);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");

  const location = useLocation();

  // Extract job1 & job2 from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const j1 = params.get("job1");
    const j2 = params.get("job2");

    if (j1) setSelected1(j1);
    if (j2) setSelected2(j2);
  }, [location.search]);

  // Fetch all jobs
  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // Auto-load job details when selected1 or selected2 changes
  useEffect(() => {
    if (selected1) {
      fetch(`http://localhost:4000/jobs/${selected1}`)
        .then(res => res.json())
        .then(data => setJob1(data))
        .catch(err => console.error("Error fetching job1:", err));
    }

    if (selected2) {
      fetch(`http://localhost:4000/jobs/${selected2}`)
        .then(res => res.json())
        .then(data => setJob2(data))
        .catch(err => console.error("Error fetching job2:", err));
    }
  }, [selected1, selected2]);

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1>Compare Jobs</h1>

          {/* Dropdowns remain available */}
          <div className="compare-selectors">
            <select
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
            >
              <option value="">Select Job 1</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>

            <select
              value={selected2}
              onChange={(e) => setSelected2(e.target.value)}
            >
              <option value="">Select Job 2</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-show comparison when both jobs are loaded */}
          {job1 && job2 ? (
            <div className="comparison-grid">
              <div className="comparison-column">
                <h2>{job1.title}</h2>
                <p><strong>Company:</strong> {job1.company}</p>
                <p><strong>Salary:</strong> {job1.salary}</p>
                <p><strong>Location:</strong> {job1.location}</p>
                <p><strong>Notes:</strong> {job1.notes}</p>
              </div>

              <div className="comparison-column">
                <h2>{job2.title}</h2>
                <p><strong>Company:</strong> {job2.company}</p>
                <p><strong>Salary:</strong> {job2.salary}</p>
                <p><strong>Location:</strong> {job2.location}</p>
                <p><strong>Notes:</strong> {job2.notes}</p>
              </div>
            </div>
          ) : (
            <p className="muted-text">Select two jobs to compare.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
