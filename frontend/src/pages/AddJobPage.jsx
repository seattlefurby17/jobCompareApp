import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./AddJobPage.css";


export default function AddJobPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    personal_dev_fund: ""
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:4000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
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

          <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
            <div className="two-col" style={{ gap: "2rem" }}>
              
              <div className="form-col">
                <label>Job Title</label>
                <input name="title" value={formData.title} onChange={handleChange} />

                <label>Company</label>
                <input name="company" value={formData.company} onChange={handleChange} />

                <label>City</label>
                <input name="city" value={formData.city} onChange={handleChange} />

                <label>State</label>
                <input name="state" value={formData.state} onChange={handleChange} />

                <label>Cost of Living Index</label>
                <input
                  type="number"
                  name="cost_of_living_index"
                  value={formData.cost_of_living_index}
                  onChange={handleChange}
                />
              </div>

              <div className="form-col">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                />

                <label>Bonus</label>
                <input
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                />

                <label>Stock Options</label>
                <input
                  type="number"
                  name="stock_options"
                  value={formData.stock_options}
                  onChange={handleChange}
                />

                <label>Wellness Stipend</label>
                <input
                  type="number"
                  name="wellness_stipend"
                  value={formData.wellness_stipend}
                  onChange={handleChange}
                />

                <label>Life Insurance</label>
                <input
                  type="number"
                  name="life_insurance"
                  value={formData.life_insurance}
                  onChange={handleChange}
                />

                <label>Personal Dev Fund</label>
                <input
                  type="number"
                  name="personal_dev_fund"
                  value={formData.personal_dev_fund}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button type="submit" className="primary">Save Job</button>
              <button type="button" className="secondary" onClick={() => navigate("/jobs")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
