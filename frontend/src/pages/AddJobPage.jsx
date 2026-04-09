import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import JobForm from "../components/JobForm";
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
          <h1>Add New Job</h1>

          <JobForm
            job={job}
            setJob={setJob}
            onSubmit={handleSubmit}
            mode="add"
            onCancel={() => navigate("/jobs")}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
