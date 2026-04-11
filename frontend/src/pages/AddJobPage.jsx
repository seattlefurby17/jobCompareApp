import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobForm.css";

export default function AddJobPage() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    city: "",
    state: "",
    cost_of_living_index: "",
    salary: "",
    bonus: "",
    stock_options: "",
    wellness_stipend: "",
    life_insurance: "",
    personal_dev_fund: "",
    is_current_job: 0
  });

  function handleChange(field, value) {
    setJob(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    })
      .then(res => res.json())
      .then(() => navigate("/jobs"))
      .catch(err => console.error("Error adding job:", err));
  }

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1 className="page-title">Add Job</h1>

          <form onSubmit={handleSubmit}>
            {/* LOCATION */}
            <div className="section-header">Location</div>
            <div className="form-grid">

              <div className="form-row">
                <label>Job Title</label>
                <input
                  type="text"
                  value={job.title}
                  onChange={e => handleChange("title", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Company</label>
                <input
                  type="text"
                  value={job.company}
                  onChange={e => handleChange("company", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>City</label>
                <input
                  type="text"
                  value={job.city}
                  onChange={e => handleChange("city", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>State</label>
                <input
                  type="text"
                  value={job.state}
                  onChange={e => handleChange("state", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Cost Of Living Index</label>
                <input
                  type="number"
                  value={job.cost_of_living_index}
                  onChange={e => handleChange("cost_of_living_index", e.target.value)}
                />
              </div>

            </div>

            <hr className="divider" />

            {/* COMPENSATION */}
            <div className="section-header">Compensation</div>
            <div className="form-grid">

              <div className="form-row">
                <label>Salary</label>
                <input
                  type="number"
                  value={job.salary}
                  onChange={e => handleChange("salary", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Bonus</label>
                <input
                  type="number"
                  value={job.bonus}
                  onChange={e => handleChange("bonus", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Stock Options</label>
                <input
                  type="number"
                  value={job.stock_options}
                  onChange={e => handleChange("stock_options", e.target.value)}
                />
              </div>

            </div>

            <hr className="divider" />

            {/* BENEFITS */}
            <div className="section-header">Benefits</div>
            <div className="benefits-grid">

              <div className="form-row">
                <label>Wellness Stipend</label>
                <input
                  type="number"
                  value={job.wellness_stipend}
                  onChange={e => handleChange("wellness_stipend", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Life Insurance</label>
                <input
                  type="number"
                  value={job.life_insurance}
                  onChange={e => handleChange("life_insurance", e.target.value)}
                />
              </div>

              <div className="form-row">
                <label>Personal Dev Fund</label>
                <input
                  type="number"
                  value={job.personal_dev_fund}
                  onChange={e => handleChange("personal_dev_fund", e.target.value)}
                />
              </div>

            </div>

            <div className="form-buttons">
              <button className="primary" type="submit">Add Job</button>
              <button className="secondary" type="button" onClick={() => navigate("/jobs")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
