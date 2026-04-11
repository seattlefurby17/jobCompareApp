import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobForm.css";
import "../styles/ComparePage.css";

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [job1, setJob1] = useState("");
  const [job2, setJob2] = useState("");
  const [result, setResult] = useState(null);

  const formatNumber = (num) =>
    Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  // Load jobs
  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error loading jobs:", err));
  }, []);

  // Hydrate from URL
  useEffect(() => {
    const j1 = searchParams.get("job1");
    const j2 = searchParams.get("job2");

    if (j1) setJob1(j1);
    if (j2) setJob2(j2);
  }, [searchParams]);

  // Auto-run compare
  useEffect(() => {
    if (job1 && job2) {
      handleCompare();
    }
  }, [job1, job2]);

  function handleCompare() {
    if (!job1 || !job2) return;

    fetch("http://localhost:4000/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job1_id: Number(job1),
        job2_id: Number(job2)
      })
    })
      .then(res => res.json())
      .then(data => setResult(data))
      .catch(err => console.error("Error comparing jobs:", err));
  }

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card compare-container">
          <h1 className="page-title">Compare Jobs</h1>

          {/* Job selection */}
          <div className="compare-select-grid">
            <div className="form-row">
              <label>Select Job 1</label>
              <select value={job1} onChange={e => setJob1(e.target.value)}>
                <option value="">Select first job</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Select Job 2</label>
              <select value={job2} onChange={e => setJob2(e.target.value)}>
                <option value="">Select second job</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              className="primary"
              onClick={handleCompare}
              disabled={!job1 || !job2}
            >
              Compare
            </button>

            <button
              className="secondary"
              onClick={() => navigate("/jobs")}
            >
              Cancel
            </button>
          </div>

          {/* Results */}
          {result && (
            <>
              <hr className="divider" />
              <div className="section-header">Comparison Results</div>

              <div className="winner-highlight">
                Winner: {result.winner.title} — {result.winner.company}
              </div>

              <div className="compare-cards">
                <div className="compare-card">
                  <h2>{result.job1.title} — {result.job1.company}</h2>
                  <p><strong>Score:</strong> {formatNumber(result.job1.score)}</p>
                </div>

                <div className="compare-card">
                  <h2>{result.job2.title} — {result.job2.company}</h2>
                  <p><strong>Score:</strong> {formatNumber(result.job2.score)}</p>
                </div>
              </div>

              <h3 style={{ marginTop: "2rem" }}>Category Breakdown</h3>

              <div className="category-compare-grid">
                {[
                  ["Salary", "salary"],
                  ["Bonus", "bonus"],
                  ["Stock Options", "stock_options"],
                  ["Wellness Stipend", "wellness_stipend"],
                  ["Life Insurance", "life_insurance"],
                  ["Personal Dev Fund", "personal_dev_fund"],
                  ["Cost of Living Index", "cost_of_living_index"]
                ].map(([label, key]) => (
                  <div className="category-compare-row" key={key}>
                    <span>{label}</span>
                    <span>
                      {key === "cost_of_living_index"
                        ? result.job1[key]
                        : formatNumber(result.job1[key])}
                    </span>
                    <span>
                      {key === "cost_of_living_index"
                        ? result.job2[key]
                        : formatNumber(result.job2[key])}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
