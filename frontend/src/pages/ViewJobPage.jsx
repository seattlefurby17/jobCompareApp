import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/JobForm.css";

export default function ViewJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error("Error loading job:", err));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <>
      <NavBar />

      <div className="page">
        <div className="card">
          <h1 className="page-title">Job Details</h1>

          {/* LOCATION */}
          <div className="section-header">Location</div>
          <div className="form-grid">

            <div className="form-row">
              <label>Job Title</label>
              <div>{job.title}</div>
            </div>

            <div className="form-row">
              <label>Company</label>
              <div>{job.company}</div>
            </div>

            <div className="form-row">
              <label>City</label>
              <div>{job.city}</div>
            </div>

            <div className="form-row">
              <label>State</label>
              <div>{job.state}</div>
            </div>

            <div className="form-row">
              <label>Cost Of Living Index</label>
              <div>{job.cost_of_living_index}</div>
            </div>

          </div>

          <hr className="divider" />

          {/* COMPENSATION */}
          <div className="section-header">Compensation</div>
          <div className="form-grid">

            <div className="form-row">
              <label>Salary</label>
              <div>{job.salary}</div>
            </div>

            <div className="form-row">
              <label>Bonus</label>
              <div>{job.bonus}</div>
            </div>

            <div className="form-row">
              <label>Stock Options</label>
              <div>{job.stock_options}</div>
            </div>

          </div>

          <hr className="divider" />

          {/* BENEFITS */}
          <div className="section-header">Benefits</div>
          <div className="benefits-grid">

            <div className="form-row">
              <label>Wellness Stipend</label>
              <div>{job.wellness_stipend}</div>
            </div>

            <div className="form-row">
              <label>Life Insurance</label>
              <div>{job.life_insurance}</div>
            </div>

            <div className="form-row">
              <label>Personal Dev Fund</label>
              <div>{job.personal_dev_fund}</div>
            </div>

          </div>

          <div className="form-buttons">
            <button className="primary" onClick={() => navigate(`/edit/${job.id}`)}>
              Edit Job
            </button>

            <button className="secondary" onClick={() => navigate("/jobs")}>
              Back
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
