import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ComparePage() {
  const [jobs, setJobs] = useState([]);
  const [job1, setJob1] = useState("");
  const [job2, setJob2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   // ⭐ Added

  // Fetch all jobs
  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  function handleCompare(e) {
    e.preventDefault();

    if (!job1 || !job2 || job1 === job2) {
      alert("Please select two different jobs");
      return;
    }

    setLoading(true);

    fetch("http://localhost:4000/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job1_id: Number(job1),
        job2_id: Number(job2)
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Compare Result:", data);
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error comparing jobs:", err);
        setLoading(false);
      });
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Compare Jobs</h1>

      {/* Select Jobs */}
      <form
        onSubmit={handleCompare}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px"
        }}
      >
        <label>Select Job 1</label>
        <select value={job1} onChange={e => setJob1(e.target.value)}>
          <option value="">-- choose a job --</option>
          {jobs.map(j => (
            <option key={j.id} value={j.id}>
              {j.title} — {j.company}
            </option>
          ))}
        </select>

        <label>Select Job 2</label>
        <select value={job2} onChange={e => setJob2(e.target.value)}>
          <option value="">-- choose a job --</option>
          {jobs.map(j => (
            <option key={j.id} value={j.id}>
              {j.title} — {j.company}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">Compare</button>

          {/* ⭐ Cancel button */}
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            style={{ background: "#ccc" }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && <p>Comparing jobs...</p>}

      {/* Results */}
      {result && result.job1 && result.job2 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Results</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginTop: "1rem"
            }}
          >
            {/* Job 1 */}
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                background:
                  result.winner === result.job1.id ? "#e6ffe6" : "white"
              }}
            >
              <h3>
                {result.job1.title} — {result.job1.company}
              </h3>
              <p>Score: {result.job1.score}</p>
              <p>Salary: {result.job1.salary}</p>
              <p>Bonus: {result.job1.bonus}</p>
              <p>Stock Options: {result.job1.stock_options}</p>
              <p>Wellness Stipend: {result.job1.wellness_stipend}</p>
              <p>Life Insurance: {result.job1.life_insurance}</p>
              <p>Personal Dev Fund: {result.job1.personal_dev_fund}</p>
            </div>

            {/* Job 2 */}
            <div
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                background:
                  result.winner === result.job2.id ? "#e6ffe6" : "white"
              }}
            >
              <h3>
                {result.job2.title} — {result.job2.company}
              </h3>
              <p>Score: {result.job2.score}</p>
              <p>Salary: {result.job2.salary}</p>
              <p>Bonus: {result.job2.bonus}</p>
              <p>Stock Options: {result.job2.stock_options}</p>
              <p>Wellness Stipend: {result.job2.wellness_stipend}</p>
              <p>Life Insurance: {result.job2.life_insurance}</p>
              <p>Personal Dev Fund: {result.job2.personal_dev_fund}</p>
            </div>
          </div>

          <h2 style={{ marginTop: "1.5rem" }}>
            Winner:{" "}
            <span style={{ color: "green" }}>
              {result.winner === result.job1.id
                ? `${result.job1.title} — ${result.job1.company}`
                : `${result.job2.title} — ${result.job2.company}`}
            </span>
          </h2>
        </div>
      )}
    </div>
  );
}
