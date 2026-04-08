import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./ComparePage.css";

export default function ComparePage() {
  const [jobs, setJobs] = useState([]);
  const [job1, setJob1] = useState("");
  const [job2, setJob2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function formatMoney(value) {
    if (value === null || value === undefined) return "—";
    return `$${Number(value).toLocaleString()}`;
  }

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  function handleCompare(e) {
    e.preventDefault();
    if (!job1 || !job2 || job1 === job2) return;

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
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error comparing jobs:", err);
        setLoading(false);
      });
  }

  const invalidSelection = job1 && job2 && job1 === job2;
  const canCompare = job1 && job2 && !invalidSelection;

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1>Compare Jobs</h1>

          <form onSubmit={handleCompare} className="compare-form">
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
            <select
              value={job2}
              onChange={e => setJob2(e.target.value)}
              disabled={!job1}
            >
              <option value="">-- choose a job --</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company}
                </option>
              ))}
            </select>

            {invalidSelection && (
              <p className="error-text">Please select two different jobs.</p>
            )}

            <div className="compare-buttons">
              <button type="submit" className="primary" disabled={!canCompare}>
                Compare
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => navigate("/jobs")}
              >
                Cancel
              </button>
            </div>
          </form>

          {loading && <p>Comparing jobs...</p>}

          {result && (
            <div className="compare-results">
              <h2>Results</h2>

              <div className="compare-grid">
                <div
                  className={
                    result.winner === result.job1.id
                      ? "compare-card winner"
                      : "compare-card"
                  }
                >
                  <h3>
                    {result.job1.title} — {result.job1.company}
                  </h3>
                  <p>Score: {result.job1.score}</p>
                  <p>Salary: {formatMoney(result.job1.salary)}</p>
                  <p>Bonus: {formatMoney(result.job1.bonus)}</p>
                  <p>Stock Options: {formatMoney(result.job1.stock_options)}</p>
                  <p>Wellness Stipend: {formatMoney(result.job1.wellness_stipend)}</p>
                  <p>Life Insurance: {formatMoney(result.job1.life_insurance)}</p>
                  <p>Personal Dev Fund: {formatMoney(result.job1.personal_dev_fund)}</p>
                </div>

                <div
                  className={
                    result.winner === result.job2.id
                      ? "compare-card winner"
                      : "compare-card"
                  }
                >
                  <h3>
                    {result.job2.title} — {result.job2.company}
                  </h3>
                  <p>Score: {result.job2.score}</p>
                  <p>Salary: {formatMoney(result.job2.salary)}</p>
                  <p>Bonus: {formatMoney(result.job2.bonus)}</p>
                  <p>Stock Options: {formatMoney(result.job2.stock_options)}</p>
                  <p>Wellness Stipend: {formatMoney(result.job2.wellness_stipend)}</p>
                  <p>Life Insurance: {formatMoney(result.job2.life_insurance)}</p>
                  <p>Personal Dev Fund: {formatMoney(result.job2.personal_dev_fund)}</p>
                </div>
              </div>

              <h2 className="winner-text">
                Winner:{" "}
                {result.winner === result.job1.id
                  ? `${result.job1.title} — ${result.job1.company}`
                  : `${result.job2.title} — ${result.job2.company}`}
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
